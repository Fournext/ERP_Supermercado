package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Repisa;
import com.example.back_API_ERP_Supermercado.Entidad.Sector;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.RepisaDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.SectorDTO;
import com.example.back_API_ERP_Supermercado.Servicios.RepisaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/repisa")
public class RepisaController {
    @Autowired
    private RepisaService repisaService;

    @PostMapping("/crear")
    public RepisaDTO crearRepisa(@RequestBody RepisaDTO repisaDTO) {
        Repisa repisa = Repisa.builder()
                .codigo(repisaDTO.getCodigo())
                .capacidad(repisaDTO.getCapacidad())
                .id_sector(repisaDTO.getSector().getId_sector())
                .build();
        Repisa nuevaRepisa = repisaService.crearRepisa(repisa);
        return convertirADTO(nuevaRepisa);
    }

    @PutMapping("/editar/{id}")
    public RepisaDTO editarRepisa(@PathVariable Integer id, @RequestBody RepisaDTO repisaDTO) {
        Repisa repisa = Repisa.builder()
                .codigo(repisaDTO.getCodigo())
                .capacidad(repisaDTO.getCapacidad())
                .id_sector(repisaDTO.getSector().getId_sector())
                .build();
        Repisa repisaActualizada = repisaService.editarRepisa(id, repisa);
        return convertirADTO(repisaActualizada);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminarRepisa(@PathVariable Integer id) {
        repisaService.eliminarRepisa(id);
    }

    @GetMapping("/getRepisa/{id}")
    public RepisaDTO obtenerRepisa(@PathVariable Integer id) {
        Repisa repisa = repisaService.obtenerRepisa(id);
        return convertirADTO(repisa);
    }

    @GetMapping("/getRepisas")
    public List<RepisaDTO> obtenerTodasLasRepisas() {
        return repisaService.obtenerTodasLasRepisas()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private RepisaDTO convertirADTO(Repisa repisa) {
        Sector sector = repisaService.obtenerSectorPorId(repisa.getId_sector());

        SectorDTO sectorDTO = new SectorDTO();
        sectorDTO.setId_sector(sector.getId_sector());
        sectorDTO.setNombre(sector.getNombre());
        sectorDTO.setUbicacion(sector.getUbicacion());

        RepisaDTO dto = new RepisaDTO();
        dto.setId_repisa(repisa.getId_repisa());
        dto.setCodigo(repisa.getCodigo());
        dto.setCapacidad(repisa.getCapacidad());
        dto.setSector(sectorDTO);

        return dto;
    }
}
