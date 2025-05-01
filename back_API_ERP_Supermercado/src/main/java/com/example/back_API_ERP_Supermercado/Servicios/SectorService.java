package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Sector;
import com.example.back_API_ERP_Supermercado.Repositorio.SectorRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SectorService {
    @Autowired
    private SectorRepositorio sectorRepositorio;

    public Sector crearSector(Sector sector) {
        return sectorRepositorio.save(sector);
    }

    public Sector editarSector(Integer id, Sector sectorActualizado) {
        Optional<Sector> sectorExistente = sectorRepositorio.findById(id);
        if (sectorExistente.isPresent()) {
            Sector sector = sectorExistente.get();
            sector.setNombre(sectorActualizado.getNombre());
            sector.setUbicacion(sectorActualizado.getUbicacion());
            return sectorRepositorio.save(sector);
        } else {
            throw new RuntimeException("Sector no encontrado con id " + id);
        }
    }

    public void eliminarSector(Integer id) {
        sectorRepositorio.deleteById(id);
    }

    public Sector obtenerSector(Integer id) {
        return sectorRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Sector no encontrado con id " + id));
    }

    public List<Sector> obtenerTodosLosSectores() {
        return sectorRepositorio.findAll();
    }
}
