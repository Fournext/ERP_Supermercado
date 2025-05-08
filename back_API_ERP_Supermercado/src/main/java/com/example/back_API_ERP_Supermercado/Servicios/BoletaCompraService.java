package com.example.back_API_ERP_Supermercado.Servicios;


import com.example.back_API_ERP_Supermercado.Entidad.BoletaCompra;
import com.example.back_API_ERP_Supermercado.Entidad.DetalleBoletaCompra;
import com.example.back_API_ERP_Supermercado.Repositorio.BoletaCompraRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BoletaCompraService {
    @Autowired
    private BoletaCompraRepositorio boletaCompraRepositorio;

    public BoletaCompra insertarBoletaCompra(BoletaCompra boletaCompra){
        return this.boletaCompraRepositorio.save(boletaCompra);
    }

    //todo:implementar el listar

    public List<BoletaCompra> listarBoletasCompras(){
        return this.boletaCompraRepositorio.findAll();
    }

    public BoletaCompra editarBoletaCompra(Integer id, BoletaCompra boletaCompraActualizado){
        Optional<BoletaCompra> boletaExistente=this.boletaCompraRepositorio.findById(id);
        if(boletaExistente.isPresent()){
            BoletaCompra boletaCompra1=boletaExistente.get();
            boletaCompra1.setCostoTotal(boletaCompraActualizado.getCostoTotal());
            boletaCompra1.setFecha(boletaCompraActualizado.getFecha());
            boletaCompra1.setIdProveedor(boletaCompraActualizado.getIdProveedor());
            boletaCompra1.setIdMetodoPago(boletaCompraActualizado.getIdMetodoPago());
            boletaCompra1.setEstado(boletaCompraActualizado.getEstado());
            return this.boletaCompraRepositorio.save(boletaCompra1);
        }else{
            throw new RuntimeException("Boleta de compra no encontrada");
        }
    }




}
