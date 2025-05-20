package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.BoletaEntrada;
import com.example.back_API_ERP_Supermercado.Repositorio.BoletaEntradaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoletaEntradaService {
    @Autowired
    private BoletaEntradaRepositorio boletaEntradaRepositorio;

    public BoletaEntrada registrarBoletaEntrada(BoletaEntrada boletaEntrada){
        return this.boletaEntradaRepositorio.save(boletaEntrada);
    }

    public List<BoletaEntrada> listarBoletaEntrada(){
        return this.boletaEntradaRepositorio.findAll();
    }

    public void eliminarBoleta(Integer id){
        this.boletaEntradaRepositorio.eliminarBoleta(id);
    }

}
