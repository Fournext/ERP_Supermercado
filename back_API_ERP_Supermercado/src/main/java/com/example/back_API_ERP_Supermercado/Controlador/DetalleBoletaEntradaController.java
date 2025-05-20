package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.BoletaEntrada;
import com.example.back_API_ERP_Supermercado.Entidad.DetalleBoletaEntrada;
import com.example.back_API_ERP_Supermercado.Servicios.DetalleBoletaEntradaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle_boleta_entrada")
public class DetalleBoletaEntradaController {
    @Autowired
    private DetalleBoletaEntradaService detalleBoletaEntradaService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarDetalleBoletaCompra(@RequestBody DetalleBoletaEntrada detalleBoletaEntrada){
        try{
            DetalleBoletaEntrada detalleBoletaActual=this.detalleBoletaEntradaService.registrarDetalleBoletaEntrada(detalleBoletaEntrada);
            return ResponseEntity.status(HttpStatus.CREATED).body(detalleBoletaActual);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo registrar el detalle"+e.getMessage());
        }
    }

    @GetMapping("/listar")
    public List<DetalleBoletaEntrada> listarDetalles(){
        return this.detalleBoletaEntradaService.listarDetalleBoletaEntrada();
    }

    @GetMapping("/obtenerDetallesByIdBoleta")
    public ResponseEntity<?> obtenerDetallesByIdBoleta(@RequestParam Integer id){
        try{
            List<DetalleBoletaEntrada> listaActual=this.detalleBoletaEntradaService.obtenerDetallesByIdBoletaEntrada(id);
            return ResponseEntity.status(HttpStatus.OK).body(listaActual);
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se encontraron Detalles con ese id,"+ id + e.getMessage());
        }
    }


}
