package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Carrito;
import com.example.back_API_ERP_Supermercado.Entidad.DetalleCarritoCompra;
import com.example.back_API_ERP_Supermercado.Servicios.DetalleCarritoCompraService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle-carrito")
public class DetalleCarritoCompraController {
    @Autowired
    private DetalleCarritoCompraService detalleCarritoCompraService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarDetalle(@RequestBody DetalleCarritoCompra detalleCarritoCompra){
        try{
            DetalleCarritoCompra carritoActual=this.detalleCarritoCompraService.registrarDetalle(detalleCarritoCompra);
            return ResponseEntity.status(HttpStatus.CREATED).body(carritoActual);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/obtener-by-carrito")
    public ResponseEntity<?> listarDetalle(@RequestParam Integer id){
        try{
            List<DetalleCarritoCompra> listaDetalleActual=this.detalleCarritoCompraService.listaDetalleCarrito(id);
            return ResponseEntity.status(HttpStatus.CREATED).body(listaDetalleActual);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
