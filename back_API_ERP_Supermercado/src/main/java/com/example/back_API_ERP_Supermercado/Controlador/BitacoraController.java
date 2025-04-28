package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Servicios.BitacoraService;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BitacoraDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/bitacora")
public class BitacoraController {
    @Autowired
    private BitacoraService bitacoraService;

    @PostMapping("/cargar")
    public ResponseEntity<?> cargarBitacora(@RequestBody Map<String, Object> datos) {
        String username = (String) datos.get("username");
        String ip = (String) datos.get("ip");
        String fecha = (String) datos.get("fecha");
        String descripcion = (String) datos.get("descripcion");
        try {
            bitacoraService.cargarBitacora(username, ip,fecha,descripcion);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }

    }

    @GetMapping("/getBitacoras")
    public ResponseEntity<List<BitacoraDTO>> obtenerBitacoras() {
        try {
            List<BitacoraDTO> bitacoras = bitacoraService.obtenerBitacoras();
            return ResponseEntity.ok(bitacoras);
        } catch (RuntimeException e) {
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("bitacoras", new ArrayList<>()); // Lista vacía
            respuesta.put("error", e.getMessage()); // Mensaje del error
            return ResponseEntity.internalServerError().body((List<BitacoraDTO>) respuesta);
        }
    }
}
