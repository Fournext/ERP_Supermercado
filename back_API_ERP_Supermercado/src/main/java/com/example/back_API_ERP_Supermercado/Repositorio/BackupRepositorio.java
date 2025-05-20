package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.Backup;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BackupGETDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;

import java.util.List;

public interface BackupRepositorio extends JpaRepository<Backup,Integer> {
    @Procedure(procedureName = "insertar_backup")
    void insertarBackup(
            String p_username,
            String p_nombre_archivo,
            String p_fecha,
            String p_tipo
    );

    @Query(value = "SELECT * FROM obtener_backups()", nativeQuery = true)
    List<BackupGETDTO> obtenerBackups();
}
