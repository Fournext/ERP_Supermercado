package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.ProductoImagen;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.ActualizarImagenDTO;
import com.example.back_API_ERP_Supermercado.Servicios.ProductoImagenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/imagenes")
public class ProductoImagenController {

    @Autowired
    private ProductoImagenService productoImagenService;

    // Obtener todas las imágenes
    @GetMapping("/listar")
    public ResponseEntity<List<ProductoImagen>> listarImagenes() {
        List<ProductoImagen> imagenes = productoImagenService.listartImagenes();
        return ResponseEntity.ok(imagenes);
    }

    // Insertar una nueva imagen
    @PostMapping("/insertar")
    public ResponseEntity<ProductoImagen> insertarImagen(@RequestBody ProductoImagen imagen) {
        ProductoImagen nuevaImagen = productoImagenService.insertarImangen(imagen);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaImagen);
    }
    //esto recibe las propiedades del actualizarImagenDto
    @PutMapping("/actualizar_url")
    public ResponseEntity<String> actualizarUrlImagen(@RequestBody ActualizarImagenDTO dto) {
        try {
            productoImagenService.actualizarUrl(dto.getIdImagen(), dto.getUrl());
            return ResponseEntity.ok("URL actualizada con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la URL: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarImagen(@PathVariable("id") Integer id) {
        try {
            productoImagenService.eliminarImagen(id);
            return ResponseEntity.ok("Imagen eliminada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la imagen: " + e.getMessage());
        }
    }
}
