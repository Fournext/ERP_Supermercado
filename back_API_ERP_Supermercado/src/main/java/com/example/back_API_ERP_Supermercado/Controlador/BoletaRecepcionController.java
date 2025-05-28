package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.BoletaRecepcion;
import com.example.back_API_ERP_Supermercado.Servicios.BoletaRecepcionService;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BoletaRecepcionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boleta_recepcion")
public class BoletaRecepcionController {
    @Autowired
    private BoletaRecepcionService boletaServicio;

    @GetMapping("/listar")
    public List<BoletaRecepcionDTO> listarTodas() {
        return boletaServicio.obtenerTodas();
    }

    @GetMapping("/listar/{id}")
    public ResponseEntity<BoletaRecepcionDTO> obtenerPorId(@PathVariable Integer id) {
        return boletaServicio.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/crear")
    public BoletaRecepcion crear(@RequestBody BoletaRecepcion boleta) {
        return boletaServicio.crear(boleta);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<BoletaRecepcion> actualizar(@PathVariable Integer id, @RequestBody BoletaRecepcion boleta) {
        try {
            return ResponseEntity.ok(boletaServicio.actualizar(id, boleta));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        boletaServicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/existe_val/{idFactura}")
    public ResponseEntity<Boolean> existeValoracionPorFactura(@PathVariable Integer idFactura) {
        boolean existe = boletaServicio.existeValoracionPorFactura(idFactura);
        return ResponseEntity.ok(existe);
    }
    @GetMapping("/listar_porfactura/{idFactura}")
    public ResponseEntity<BoletaRecepcion> obtenerPorIdFactura(@PathVariable Integer idFactura) {
        return boletaServicio.obtenerPorIdFactura(idFactura)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
