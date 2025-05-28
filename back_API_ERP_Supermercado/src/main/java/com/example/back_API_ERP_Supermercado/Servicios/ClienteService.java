package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Cliente;
import com.example.back_API_ERP_Supermercado.Repositorio.ClienteRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepositorio clienteRepositorio;

    public Cliente registrarCliente(Cliente cliente){
        return this.clienteRepositorio.save(cliente);
    }

    public Cliente obtenerClienteByUser(Integer id){
        return this.clienteRepositorio.obtenerClienteByUsuario(id);
    }

    public Cliente obtenerClientePorId(Integer id) {
        return clienteRepositorio.findById(id).orElse(null);
    }
}
