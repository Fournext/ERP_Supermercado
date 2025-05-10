package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Servicios.BoletaSalidaService;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BoletaSalidaDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BoletaSalidaGETDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boleta_salida")
public class BoletaSalidaController {
    @Autowired
    private BoletaSalidaService boletaSalidaService;

    @PostMapping("/crear")
    public ResponseEntity<?> insertarBoleta(@RequestBody BoletaSalidaDTO dto) {
        try {
            boletaSalidaService.insertarBoletaSalida(dto);
            return ResponseEntity.ok().build(); // HTTP 200 sin cuerpo
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al insertar boleta de salida: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarBoleta(@PathVariable Integer id) {
        try {
            boletaSalidaService.eliminarBoletaSalida(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar boleta de salida: " + e.getMessage());
        }
    }

    @GetMapping("/getBoletas_salida")
    public ResponseEntity<?> obtenerBoletas() {
        try {
            List<BoletaSalidaGETDTO> lista = boletaSalidaService.obtenerBoletasSalida();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener boletas de salida: " + e.getMessage());
        }
    }

    @GetMapping("/getBoleta_salida/{id}")
    public ResponseEntity<?> obtenerBoleta(@PathVariable Integer id) {
        try {
            return boletaSalidaService.obtenerBoletaSalidaPorId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener boleta de salida: " + e.getMessage());
        }
    }
}
