package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Categorias;
import com.example.back_API_ERP_Supermercado.Entidad.Marca;
import com.example.back_API_ERP_Supermercado.Servicios.CategoriaService;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.ProductoPrecioDTO;
import com.example.back_API_ERP_Supermercado.Servicios.MarcaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marca")
public class MarcaController {
    @Autowired
    private MarcaService marcaService;

    @GetMapping("/listar")
    public List<Marca> listaMarca(){
        return this.marcaService.getMarca();
    }

    @GetMapping("/getMarca")
    public ResponseEntity<Marca> obtenerMarcaByName(@RequestParam String nombre){
        return this.marcaService.getMarcaByName(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/crear")
    public ResponseEntity<Marca> crearCategorias(@RequestBody Marca marca){
        Marca nuevaMarca=this.marcaService.crearMarca(marca);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaMarca);
    }

    @PutMapping("/actualizar")
    public ResponseEntity<Map<String, String>> actualizarMarca(@RequestBody Marca marca) {
        try {
            marcaService.actualizarNombre(marca);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Nombre actualizado correctamente");
            return ResponseEntity.ok(response);  // Devuelve un JSON con un mensaje
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al actualizar nombre: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
