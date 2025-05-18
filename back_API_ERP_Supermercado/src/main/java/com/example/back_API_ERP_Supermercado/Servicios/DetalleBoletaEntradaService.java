package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.DetalleBoletaEntrada;
import com.example.back_API_ERP_Supermercado.Repositorio.DetalleBoletaEntradaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleBoletaEntradaService {
    @Autowired
    private DetalleBoletaEntradaRepositorio detalleBoletaEntradaRepositorio;

    public DetalleBoletaEntrada registrarDetalleBoletaEntrada(DetalleBoletaEntrada boletaEntrada){
        return this.detalleBoletaEntradaRepositorio.save(boletaEntrada);
    }

    public List<DetalleBoletaEntrada> listarDetalleBoletaEntrada(){
        return this.detalleBoletaEntradaRepositorio.findAll();
    }

    public List<DetalleBoletaEntrada> obtenerDetallesByIdBoletaEntrada(Integer id){
        return this.detalleBoletaEntradaRepositorio.obtenerDetallesByIdBoletaEntrada(id);
    }
}
