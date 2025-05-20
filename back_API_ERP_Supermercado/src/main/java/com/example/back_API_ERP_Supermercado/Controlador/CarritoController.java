package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Carrito;
import com.example.back_API_ERP_Supermercado.Servicios.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {
    @Autowired
    private CarritoService carritoService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarCarrito(@RequestBody Carrito carrito){
        try{
            Carrito carritoActual=this.carritoService.registrarCarrito(carrito);
            return ResponseEntity.status(HttpStatus.CREATED).body(carritoActual);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/obtenerByClient")
    public ResponseEntity<?> obtenerCarrito(@RequestParam Integer id){
        try{
            Carrito carritoActual=this.carritoService.obtenerCarritoPorCliente(id);
            return ResponseEntity.status(HttpStatus.CREATED).body(carritoActual);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
