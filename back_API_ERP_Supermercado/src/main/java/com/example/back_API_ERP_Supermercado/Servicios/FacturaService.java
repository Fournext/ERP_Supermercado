package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Factura;
import com.example.back_API_ERP_Supermercado.Repositorio.FacturaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacturaService {
    @Autowired
    private FacturaRepositorio facturaRepositorio;


    public Factura registrarFactura(Factura factura){
        return this.facturaRepositorio.save(factura);
    }

    public List<Factura> listarFacturas(){
        return this.facturaRepositorio.findAll();
    }

    public List<Factura> listarFacturasPorCliente(Integer id){
        return this.facturaRepositorio.obtenerFacturasPorCliente(id);
    }
}
