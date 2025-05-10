package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.BoletaCompra;
import com.example.back_API_ERP_Supermercado.Servicios.BoletaCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boleta_compra")
public class BoletaCompraController {
    @Autowired
    private BoletaCompraService boletaCompraService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarBoletaCompra(@RequestBody BoletaCompra boletaCompra){
        try{
            BoletaCompra boletaCompra1=this.boletaCompraService.insertarBoletaCompra(boletaCompra);
            return ResponseEntity.status(HttpStatus.CREATED).body(boletaCompra1);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo registrar la Boleta de compra");
        }
    }
    @GetMapping("/listar")
    public List<BoletaCompra> listarBoletasCompras(){
        return this.boletaCompraService.listarBoletasCompras();
    }

    @PutMapping("/editar")
    public ResponseEntity<?> actualizarBoletaCompra(@RequestParam Integer id,@RequestBody BoletaCompra boletaCompra){
        try{
            BoletaCompra boletaActual=this.boletaCompraService.editarBoletaCompra(id,boletaCompra);
            return ResponseEntity.status(HttpStatus.OK).body(boletaActual);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo actualizar la boleta de compra con id:"+id);
        }
    }
}
