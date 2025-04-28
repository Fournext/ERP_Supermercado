package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Almacen;
import com.example.back_API_ERP_Supermercado.Servicios.AlmacenService;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.AlmacenDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/almacen")
public class AlmacenController {
    @Autowired
    private AlmacenService almacenService;

    @PostMapping("/crear")
    public AlmacenDTO crearAlmacen(@RequestBody AlmacenDTO almacenDTO) {
        Almacen almacen = Almacen.builder()
                .codigo(almacenDTO.getCodigo())
                .dimenciones(almacenDTO.getDimenciones())
                .build();
        Almacen almacenCreado = almacenService.crearAlmacen(almacen);
        return convertirADTO(almacenCreado);
    }

    @PutMapping("/editar/{id}")
    public AlmacenDTO editarAlmacen(@PathVariable Integer id, @RequestBody AlmacenDTO almacenDTO) {
        Almacen almacen = Almacen.builder()
                .codigo(almacenDTO.getCodigo())
                .dimenciones(almacenDTO.getDimenciones())
                .build();
        Almacen almacenActualizado = almacenService.editarAlmacen(id, almacen);
        return convertirADTO(almacenActualizado);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminarAlmacen(@PathVariable Integer id) {
        almacenService.eliminarAlmacen(id);
    }

    @GetMapping("/getAlmacen/{id}")
    public AlmacenDTO obtenerAlmacen(@PathVariable Integer id) {
        Almacen almacen = almacenService.obtenerAlmacen(id);
        return convertirADTO(almacen);
    }

    @GetMapping("/getAlmacenes")
    public List<AlmacenDTO> obtenerTodosLosAlmacenes() {
        return almacenService.obtenerTodosLosAlmacenes()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private AlmacenDTO convertirADTO(Almacen almacen) {
        AlmacenDTO dto = new AlmacenDTO();
        dto.setId_almacen(almacen.getId_almacen());
        dto.setCodigo(almacen.getCodigo());
        dto.setDimenciones(almacen.getDimenciones());
        return dto;
    }
}
