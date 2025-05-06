package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Servicios.DTO.LoteDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.LoteGETDTO;
import com.example.back_API_ERP_Supermercado.Servicios.LoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lote")
public class LoteController {

    @Autowired
    private LoteService loteService;

    @PostMapping("/crear")
    public ResponseEntity<?> insertarLote(@RequestBody LoteDTO dto) {
        try {
            loteService.insertarLote(dto);
            return ResponseEntity.ok().build(); // HTTP 200 sin mensaje
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al insertar lote: " + e.getMessage());
        }
    }

    @PutMapping("/editar")
    public ResponseEntity<?> actualizarLote(@RequestBody LoteDTO dto) {
        try {
            loteService.actualizarLote(dto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar lote: " + e.getMessage());
        }
    }

    @GetMapping("/getLotes")
    public ResponseEntity<?> obtenerLotesVista() {
        try {
            List<LoteGETDTO> lotes = loteService.obtenerLotes();
            return ResponseEntity.ok(lotes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener lotes: " + e.getMessage());
        }
    }

    @GetMapping("/getLote/{id}")
    public ResponseEntity<?> obtenerLotePorId(@PathVariable Integer id) {
        try {
            return loteService.obtenerLotePorId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener lote: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarLote(@PathVariable Integer id) {
        try {
            loteService.eliminarLote(id);
            return ResponseEntity.ok().build(); // Solo HTTP 200
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar lote: " + e.getMessage());
        }
    }
}
