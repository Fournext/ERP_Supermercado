package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.MetodoPago;
import com.example.back_API_ERP_Supermercado.Servicios.MetodoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/metodo_pago")
public class MetodoPagoController {
    @Autowired
    private MetodoPagoService metodoPagoService;

    @GetMapping("/listar")
    public List<MetodoPago> listaMetodoPago(){
        return this.metodoPagoService.listarMetodoPago();
    }
}
