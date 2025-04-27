package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Sector;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.SectorDTO;
import com.example.back_API_ERP_Supermercado.Servicios.SectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sector")
public class SectorController {
    @Autowired
    private SectorService sectorService;

    @PostMapping("/crear")
    public SectorDTO crearSector(@RequestBody SectorDTO sectorDTO) {
        Sector sector = Sector.builder()
                .nombre(sectorDTO.getNombre())
                .ubicacion(sectorDTO.getUbicacion())
                .build();
        Sector sectorCreado = sectorService.crearSector(sector);
        return convertirADTO(sectorCreado);
    }

    @PutMapping("/editar/{id}")
    public SectorDTO editarSector(@PathVariable Integer id, @RequestBody SectorDTO sectorDTO) {
        Sector sector = Sector.builder()
                .nombre(sectorDTO.getNombre())
                .ubicacion(sectorDTO.getUbicacion())
                .build();
        Sector sectorActualizado = sectorService.editarSector(id, sector);
        return convertirADTO(sectorActualizado);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminarSector(@PathVariable Integer id) {
        sectorService.eliminarSector(id);
    }

    @GetMapping("/getSector/{id}")
    public SectorDTO obtenerSector(@PathVariable Integer id) {
        Sector sector = sectorService.obtenerSector(id);
        return convertirADTO(sector);
    }

    @GetMapping("/getSectores")
    public List<SectorDTO> obtenerTodosLosSectores() {
        return sectorService.obtenerTodosLosSectores()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private SectorDTO convertirADTO(Sector sector) {
        SectorDTO dto = new SectorDTO();
        dto.setId_sector(sector.getId_sector());
        dto.setNombre(sector.getNombre());
        dto.setUbicacion(sector.getUbicacion());
        return dto;
    }
}
