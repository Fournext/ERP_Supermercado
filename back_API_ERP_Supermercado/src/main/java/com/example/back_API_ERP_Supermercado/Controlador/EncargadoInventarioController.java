package com.example.back_API_ERP_Supermercado.Controlador;


import com.example.back_API_ERP_Supermercado.Entidad.EncargadoInventario;
import com.example.back_API_ERP_Supermercado.Repositorio.EncargadoInventarioRepositorio;
import com.example.back_API_ERP_Supermercado.Servicios.LoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/encargado")
public class EncargadoInventarioController {

    @Autowired
    private EncargadoInventarioRepositorio encargadoRepo;

    @Autowired
    private LoteService loteService;

    @PutMapping("/actualizarCorreo")
    public ResponseEntity<?> actualizarCorreo(@RequestBody EncargadoInventario dto) {
        EncargadoInventario encargado = encargadoRepo.findById(dto.getIdEncargado())
                .orElseThrow(() -> new RuntimeException("Encargado no encontrado"));
        encargado.setCorreoNotificacion(dto.getCorreoNotificacion());
        encargadoRepo.save(encargado);
        return ResponseEntity.ok("Correo actualizado");
    }

    @GetMapping("/{id}")
    public ResponseEntity<EncargadoInventario> obtener(@PathVariable Integer id) {
        return encargadoRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para probar el envío
    @PostMapping("/probarNotificacion")
    public ResponseEntity<Map<String, String>> testNotificacion(@RequestParam Integer id) {
        loteService.verificarYNotificarBajoStock(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Notificaciones enviadas si había stock bajo");

        return ResponseEntity.ok(response);  // Esto será interpretado como JSON
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarEncargado(@RequestBody EncargadoInventario dto) {
        if (dto.getCorreoNotificacion() == null || dto.getCorreoNotificacion().isBlank()) {
            return ResponseEntity.badRequest().body("Debe ingresar un correo válido");
        }

        EncargadoInventario nuevo = new EncargadoInventario();
        nuevo.setNombre(dto.getNombre());
        nuevo.setCorreoNotificacion(dto.getCorreoNotificacion());
        nuevo.setIdPersonal(dto.getIdPersonal()); // ✅ AQUÍ SE ESTABA OMITIENDO

        encargadoRepo.save(nuevo);
        return ResponseEntity.ok(Map.of("message", "Encargado registrado exitosamente"));
    }

    @GetMapping("/listar")
    public List<EncargadoInventario> listar(){
        return this.encargadoRepo.findAll();
    }
}
