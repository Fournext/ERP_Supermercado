package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Repisa;
import com.example.back_API_ERP_Supermercado.Entidad.Sector;
import com.example.back_API_ERP_Supermercado.Repositorio.RepisaRepositorio;
import com.example.back_API_ERP_Supermercado.Repositorio.SectorRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RepisaService {
    @Autowired
    private RepisaRepositorio repisaRepository;

    @Autowired
    private SectorRepositorio sectorRepository;

    public Repisa crearRepisa(Repisa repisa) {
        return repisaRepository.save(repisa);
    }

    public Repisa editarRepisa(Integer id, Repisa repisaActualizado) {
        Optional<Repisa> repisaExistente = repisaRepository.findById(id);
        if (repisaExistente.isPresent()) {
            Repisa repisa = repisaExistente.get();
            repisa.setCodigo(repisaActualizado.getCodigo());
            repisa.setCapacidad(repisaActualizado.getCapacidad());
            repisa.setId_sector(repisaActualizado.getId_sector());
            return repisaRepository.save(repisa);
        } else {
            throw new RuntimeException("Repisa no encontrada con id " + id);
        }
    }

    public void eliminarRepisa(Integer id) {
        repisaRepository.deleteById(id);
    }

    public Repisa obtenerRepisa(Integer id) {
        return repisaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Repisa no encontrada con id " + id));
    }

    public List<Repisa> obtenerTodasLasRepisas() {
        return repisaRepository.findAll();
    }

    public Sector obtenerSectorPorId(Integer id_sector) {
        return sectorRepository.findById(id_sector)
                .orElseThrow(() -> new RuntimeException("Sector no encontrado con id " + id_sector));
    }
}
