package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Servicios.BackupService;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BackupDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BackupGETDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/backup")
public class BackupController {

    @Autowired
    private BackupService backupService;

    @PostMapping("/crear")
    public ResponseEntity<?> insertarBackup(@RequestBody BackupDTO dto) {
        try {
            backupService.insertarBackup(dto.getUsername(), dto.getNombre_archivo(), dto.getFecha(), dto.getTipo());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al insertar backup: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/getListBackups")
    public ResponseEntity<?> obtenerBackups() {
        try {
            List<BackupGETDTO> backups = backupService.obtenerBackups();
            return ResponseEntity.ok(backups);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener backups: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/solo-datos-sql")
    public ResponseEntity<InputStreamResource> backupSoloDatosSql() {
        try {
            String pgDumpPath = detectarPgDump();

            ProcessBuilder processBuilder = new ProcessBuilder(
                    pgDumpPath,
                    "-h", "ec2-18-117-180-26.us-east-2.compute.amazonaws.com",
                    "-U", "postgres",
                    "-d", "DB_supermarket",
                    "--data-only",
                    "-F", "p"
            );

            processBuilder.environment().put("PGPASSWORD", "071104");
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            try (InputStream is = process.getInputStream()) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = is.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Error en pg_dump. Código: " + exitCode + "\n" + outputStream);
            }

            byte[] backupBytes = outputStream.toByteArray();
            InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(backupBytes));

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=solo_datos.sql")
                    .contentLength(backupBytes.length)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(new InputStreamResource(new ByteArrayInputStream(("Error: " + e.getMessage()).getBytes())));
        }
    }

    @PostMapping("/restaurar-sql")
    public ResponseEntity<String> restaurarDesdeSql(@RequestParam("archivo") MultipartFile archivo) {
        try {
            // Guardar archivo temporal
            File tempFile = File.createTempFile("restore_", ".sql");
            try (InputStream is = archivo.getInputStream(); FileOutputStream fos = new FileOutputStream(tempFile)) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = is.read(buffer)) != -1) {
                    fos.write(buffer, 0, bytesRead);
                }
            }

            String psqlPath = detectarPsql();
            String host = probarConexion(psqlPath, "localhost") ? "localhost" : "postgres";

            // ✅ Paso 1: TRUNCATE dinámico seguro
            String dynamicTruncate = "DO $$ " +
                    "DECLARE r RECORD; " +
                    "BEGIN " +
                    "PERFORM set_config('session_replication_role', 'replica', false); " +
                    "FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP " +
                    "EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE'; " +
                    "END LOOP; " +
                    "PERFORM set_config('session_replication_role', 'origin', false); " +
                    "END $$;";

            if (!ejecutarSQL(psqlPath, host, dynamicTruncate)) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al hacer TRUNCATE dinámico.");
            }

            // ✅ Paso 2: Restaurar el backup
            ProcessBuilder restoreBuilder = new ProcessBuilder(
                    psqlPath,
                    "-h", host,
                    "-U", "postgres",
                    "-d", "DB_supermarket",
                    "-f", tempFile.getAbsolutePath()
            );
            restoreBuilder.environment().put("PGPASSWORD", "071104");
            restoreBuilder.redirectErrorStream(true);
            Process restoreProcess = restoreBuilder.start();

            StringBuilder resultado = new StringBuilder();
            try (InputStream is = restoreProcess.getInputStream()) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = is.read(buffer)) != -1) {
                    resultado.append(new String(buffer, 0, bytesRead));
                }
            }

            int exitCode = restoreProcess.waitFor();
            tempFile.delete();

            if (exitCode != 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al restaurar. Código: " + exitCode + "\n" + resultado);
            }

            // ✅ Paso 3: Reset automático de secuencias
            String resetSequences = "DO $$ " +
                    "DECLARE r RECORD; " +
                    "BEGIN " +
                    "FOR r IN (SELECT c.relname AS sequence_name, t.relname AS table_name, a.attname AS column_name " +
                    "FROM pg_class c " +
                    "JOIN pg_depend d ON d.objid = c.oid " +
                    "JOIN pg_class t ON d.refobjid = t.oid " +
                    "JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = d.refobjsubid " +
                    "WHERE c.relkind = 'S' AND d.classid = 'pg_class'::regclass AND d.deptype IN ('a')) LOOP " +
                    "EXECUTE 'SELECT setval(''' || r.sequence_name || ''', COALESCE((SELECT MAX(' || r.column_name || ') FROM ' || quote_ident(r.table_name) || '), 1), false)'; " +
                    "END LOOP; " +
                    "END $$;";

            if (!ejecutarSQL(psqlPath, host, resetSequences)) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al resetear secuencias.");
            }

            return ResponseEntity.ok("Restauración y reset de secuencias completados correctamente.\n" + resultado);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al intentar restaurar: " + e.getMessage());
        }
    }

    private boolean ejecutarSQL(String psqlPath, String host, String sql) {
        try {
            ProcessBuilder builder = new ProcessBuilder(
                    psqlPath,
                    "-h", host,
                    "-U", "postgres",
                    "-d", "DB_supermarket",
                    "-c", sql
            );
            builder.environment().put("PGPASSWORD", "071104");
            builder.redirectErrorStream(true);
            Process process = builder.start();
            StringBuilder salida = new StringBuilder();
            try (InputStream is = process.getInputStream()) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = is.read(buffer)) != -1) {
                    salida.append(new String(buffer, 0, bytesRead));
                }
            }
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                System.err.println("Error al ejecutar SQL dinámico:\n" + salida);
            }
            return exitCode == 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }



    private boolean probarConexion(String psqlPath, String host) {
        try {
            ProcessBuilder pb = new ProcessBuilder(
                    psqlPath,
                    "-h", host,
                    "-U", "postgres",
                    "-d", "DB_supermarket",
                    "-c", "\\q"
            );
            pb.environment().put("PGPASSWORD", "071104");
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int code = process.waitFor();
            return code == 0;
        } catch (Exception e) {
            return false;
        }
    }

    private String detectarPgDump() {
        File pgDumpWindows = new File("C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe");
        if (pgDumpWindows.exists()) {
            return pgDumpWindows.getAbsolutePath();
        } else {
            return "/usr/bin/pg_dump";
        }
    }

    private String detectarPsql() {
        File psqlWindows = new File("C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe");
        if (psqlWindows.exists()) {
            return psqlWindows.getAbsolutePath();
        } else {
            return "/usr/bin/psql";
        }
    }
}
