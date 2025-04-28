package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Precio;
import com.example.back_API_ERP_Supermercado.Servicios.PrecioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/precio")
public class PrecioController {
    @Autowired
    private PrecioService precioService;

    @PostMapping("/insertar")
    public ResponseEntity<?> insertarPrecio(@RequestBody Precio precio){
       try {
           Precio nuevoPrecio=this.precioService.insertarPrecio(precio);
           return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPrecio);
       }catch (Exception e){
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al insertar un precio"+ e.getMessage());
       }
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarPrecio(@RequestParam Integer idProducto, @RequestParam BigDecimal nuevoPrecio) {
        try {
            this.precioService.actualizarPrecio(idProducto, nuevoPrecio);
            return ResponseEntity.status(HttpStatus.OK).body("Precio actualizado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo actualizar el precio");
        }
    }


}
