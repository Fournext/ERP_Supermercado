package com.example.back_API_ERP_Supermercado.Controlador;


import com.example.back_API_ERP_Supermercado.Entidad.Categorias;
import com.example.back_API_ERP_Supermercado.Entidad.Marca;
import com.example.back_API_ERP_Supermercado.Servicios.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categoria")
public class CategoriaController {
    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/listar")
    public List<Categorias> listaCategorias(){
        return this.categoriaService.getCategorias();
    }

    @GetMapping("/getCategoria")
    public ResponseEntity<Categorias> obtenerCategoriaByName(@RequestParam String nombre){
        return this.categoriaService.getCategoriasByName(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/crear")
    public ResponseEntity<Categorias> crearCategorias(@RequestBody Categorias categorias){
        Categorias nuevaCategoria=this.categoriaService.crearCategoria(categorias);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria);
    }

    @PutMapping("/actualizar")
    public ResponseEntity<Map<String, String>> actualizarMarca(@RequestBody Categorias categorias) {
        try {
            categoriaService.actualizarNombreCategoria(categorias);
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
