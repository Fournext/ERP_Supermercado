package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Carrito;
import com.example.back_API_ERP_Supermercado.Repositorio.CarritoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CarritoService {
    @Autowired
    private CarritoRepositorio carritoRepositorio;

    public Carrito registrarCarrito(Carrito carrito){
        return this.carritoRepositorio.save(carrito);
    }

    public Carrito obtenerCarritoPorCliente(Integer id){
        return this.carritoRepositorio.obtenerCarritoPorCliente(id);
    }
}
