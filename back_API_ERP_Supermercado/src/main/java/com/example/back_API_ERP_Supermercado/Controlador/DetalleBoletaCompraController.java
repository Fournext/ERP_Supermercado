package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.DetalleBoletaCompra;
import com.example.back_API_ERP_Supermercado.Entidad.Proveedor;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.DetalleBoletaCompraDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DetalleBoletaCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle_boleta")
public class DetalleBoletaCompraController {

    @Autowired
    private DetalleBoletaCompraService boletaCompraService;

    @GetMapping("/obtener_detalles")
    public List<DetalleBoletaCompraDTO> obtenerDetalles(@RequestParam Integer id) {
        return boletaCompraService.obtenerDetalles(id);
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarDetalleBoletaCompra(@RequestBody DetalleBoletaCompra detalleBoletaCompra){
        try{
            DetalleBoletaCompra detalleBoletaCompra1=this.boletaCompraService.insertarDetalleBoletaCompra(detalleBoletaCompra);
            return ResponseEntity.status(HttpStatus.CREATED).body(detalleBoletaCompra1);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo registrar el detalle de la boleta de compra");
        }
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarDetalleBoletaCompra(@RequestParam Integer id,@RequestBody DetalleBoletaCompra detalleBoletaCompraActualizado){
        try{
            DetalleBoletaCompra DetalleActual=this.boletaCompraService.editarDetalleBoletaCompra(id,detalleBoletaCompraActualizado);
            return ResponseEntity.status(HttpStatus.OK).body(DetalleActual);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo actualizar el detalle con id:"+id);
        }
    }


}
