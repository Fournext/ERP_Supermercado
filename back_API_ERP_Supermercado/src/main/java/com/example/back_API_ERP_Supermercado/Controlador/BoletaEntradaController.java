package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.BoletaCompra;
import com.example.back_API_ERP_Supermercado.Entidad.BoletaEntrada;
import com.example.back_API_ERP_Supermercado.Servicios.BoletaEntradaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/boleta_entrada")
public class BoletaEntradaController {
    @Autowired
    private BoletaEntradaService boletaEntradaService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarBoletaEntrada(@RequestBody BoletaEntrada boletaEntrada){
        try{
            BoletaEntrada boletaActual=this.boletaEntradaService.registrarBoletaEntrada(boletaEntrada);
            return ResponseEntity.status(HttpStatus.CREATED).body(boletaActual);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo registrar la boleta"+e.getMessage());
        }
    }

    @GetMapping("/listar")
    public List<BoletaEntrada> listarBoletaEntrada(){
        return this.boletaEntradaService.listarBoletaEntrada();
    }

    @DeleteMapping("/eliminar")
    public ResponseEntity<?> eliminarBoleta(@RequestParam Integer id){
        try{
            this.boletaEntradaService.eliminarBoleta(id);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Boleta eliminada con éxito"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("La boleta no pudo eliminarse error: "+e.getMessage());
        }
    }
}
