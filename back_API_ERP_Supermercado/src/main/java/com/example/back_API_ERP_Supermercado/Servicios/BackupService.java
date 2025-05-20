package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Repositorio.BackupRepositorio;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BackupGETDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BackupService {
    @Autowired
    private BackupRepositorio backupRepository;

    public void insertarBackup(String username, String nombreArchivo, String fecha, String tipo) {
        backupRepository.insertarBackup(username, nombreArchivo, fecha, tipo);
    }

    public List<BackupGETDTO> obtenerBackups() {
        return backupRepository.obtenerBackups();
    }
}
