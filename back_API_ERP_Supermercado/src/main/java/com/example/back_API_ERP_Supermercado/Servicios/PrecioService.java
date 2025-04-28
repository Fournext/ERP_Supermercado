package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Precio;
import com.example.back_API_ERP_Supermercado.Repositorio.PrecioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PrecioService {
    @Autowired
    private PrecioRepositorio precioRepositorio;

    public List<Precio> getPrecios(){
        return this.precioRepositorio.findAll();
    }

    public Precio insertarPrecio(Precio precio){
        return this.precioRepositorio.save(precio);
    }

    //implementar el actualizar precio
     public void actualizarPrecio(Integer idProducto, BigDecimal nuevoPrecio){
        this.precioRepositorio.actualizarPrecioProducto(idProducto,nuevoPrecio);
     }

    //implementar eliminar precio


}
