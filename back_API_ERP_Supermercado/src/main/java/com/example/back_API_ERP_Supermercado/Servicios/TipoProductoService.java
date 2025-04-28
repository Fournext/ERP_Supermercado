package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.TipoProducto;
import com.example.back_API_ERP_Supermercado.Repositorio.TipoProductoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoProductoService {
    @Autowired
    private TipoProductoRepositorio productoRepositorio;

    public List<TipoProducto> listarTipoProductos(){
        return this.productoRepositorio.findAll();
    }

    public TipoProducto insertarTipoProducto(TipoProducto tipoProducto){
        return this.productoRepositorio.save(tipoProducto);
    }

    public  void actualizarTipoProducto(TipoProducto producto){
         this.productoRepositorio.actualizarNombreTipoProducto(producto.getIdTipo(),producto.getNombre());
    }


}
