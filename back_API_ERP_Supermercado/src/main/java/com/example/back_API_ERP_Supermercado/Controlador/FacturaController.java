package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Factura;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.MontoVentaDiarioDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.VentasProductosDiaDTO;
import com.example.back_API_ERP_Supermercado.Servicios.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/factura")
public class FacturaController {
    @Autowired
    private FacturaService facturaService;

    @PostMapping ("/registrar")
    public ResponseEntity<?> registrarFactura(@RequestBody Factura factura){
        try{
            Factura facturaActual=this.facturaService.registrarFactura(factura);
            return ResponseEntity.status(HttpStatus.CREATED).body(facturaActual);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listarFacturasPorCliente(@RequestParam Integer id){
        List<Factura> listaActual=this.facturaService.listarFacturasPorCliente(id);
        return ResponseEntity.status(HttpStatus.OK).body(listaActual);
    }

    @GetMapping("/listar-facturas")
    public ResponseEntity<?> listarFacturas(){
        List<Factura> lista=this.facturaService.listarFacturas();
        return ResponseEntity.status(HttpStatus.OK).body(lista);
    }

    @GetMapping("/listar-ventas-productos-dia")
    public ResponseEntity<?> listarVentasProductosDia(@RequestParam LocalDate inicio, @RequestParam LocalDate fin){
        List<VentasProductosDiaDTO> lista= this.facturaService.listaVentaProductosDia(inicio,fin);
        return ResponseEntity.status(HttpStatus.OK).body(lista);
    }

    @GetMapping("/listar-monto-por-dia")
    public ResponseEntity<?> listarMontoVentaPorDia(@RequestParam LocalDate inicio, @RequestParam LocalDate fin){
        List<MontoVentaDiarioDTO> lista=this.facturaService.listaMontoVentaDiaria(inicio,fin);
        return ResponseEntity.status(HttpStatus.OK).body(lista);
    }


}
