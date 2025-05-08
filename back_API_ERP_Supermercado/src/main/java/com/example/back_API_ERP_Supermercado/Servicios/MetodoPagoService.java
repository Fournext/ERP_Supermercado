package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.MetodoPago;
import com.example.back_API_ERP_Supermercado.Repositorio.MetodoPagoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MetodoPagoService {
    @Autowired
    private MetodoPagoRepositorio metodoPagoRepositorio;

    public List<MetodoPago> listarMetodoPago(){
        return this.metodoPagoRepositorio.findAll();
    }


}
