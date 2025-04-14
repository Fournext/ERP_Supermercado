package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.userET;
import com.example.back_API_ERP_Supermercado.Repositorio.userRP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class userSV {
    @Autowired
    userRP userRP;

    public List<userET> getUser(){
        return userRP.findAll();
    }
}
