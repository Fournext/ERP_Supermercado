package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.userET;
import com.example.back_API_ERP_Supermercado.Repositorio.userRP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class userSV {
    @Autowired
    userRP userRP;

    public List<userET> getUser(){
        return userRP.findAll();
    }
    public Optional<userET> getUserByUsername(String username) {
        return userRP.findByUsername(username);
    }

    public String obtenerRolPorUsername(String username) {
        return userRP.obtenerRolDeUsuario(username);
    }

}
