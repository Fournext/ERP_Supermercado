package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.DetalleBoletaCompra;
import com.example.back_API_ERP_Supermercado.Entidad.DetalleCarritoCompra;
import com.example.back_API_ERP_Supermercado.Repositorio.DetalleCarritoCompraRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleCarritoCompraService {
    @Autowired
    private DetalleCarritoCompraRepositorio detalleCarritoCompraRepositorio;

    public DetalleCarritoCompra registrarDetalle(DetalleCarritoCompra detalleCarritoCompra){
        return this.detalleCarritoCompraRepositorio.save(detalleCarritoCompra);
    }

    public List<DetalleCarritoCompra> listaDetalleCarrito(Integer id){
        return this.detalleCarritoCompraRepositorio.listaDetalleCarritoById(id);
    }

}
