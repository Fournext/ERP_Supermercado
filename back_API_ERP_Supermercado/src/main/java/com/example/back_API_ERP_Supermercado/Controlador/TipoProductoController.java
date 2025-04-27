package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.TipoProducto;
import com.example.back_API_ERP_Supermercado.Servicios.TipoProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipo_producto")
public class TipoProductoController {
    @Autowired
    private TipoProductoService tipoProductoService;

    @GetMapping("/listar")
    public ResponseEntity<List<TipoProducto>> listarTipoProductos() {
        List<TipoProducto> tipoProductos = this.tipoProductoService.listarTipoProductos();
        return ResponseEntity.ok(tipoProductos);
    }

    // Insertar una nuevo Tipo de producto
    @PostMapping("/insertar")
    public ResponseEntity<?> insertarTipoProducto(@RequestBody TipoProducto tipoProducto) {
        try {
            TipoProducto nuevaTipoProducto = this.tipoProductoService.insertarTipoProducto(tipoProducto);
            return ResponseEntity.status(HttpStatus.CREATED).body(tipoProducto);
        }catch (Exception e){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registar el producto error: "+e.getMessage());
        }
    }
    //esto recibe las propiedades del actualizarImagenDto
    @PutMapping("/actualizar_nombre")
    public ResponseEntity<String> actualizarNombreTipoProducto(@RequestBody TipoProducto tipoProducto) {
        try {
            this.tipoProductoService.actualizarTipoProducto(tipoProducto);
            return ResponseEntity.ok("Nombre actualizado con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el nombre: " + e.getMessage());
        }
    }
}
