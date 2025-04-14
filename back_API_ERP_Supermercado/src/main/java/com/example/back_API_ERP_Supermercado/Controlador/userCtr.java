package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.userET;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.back_API_ERP_Supermercado.Servicios.userSV;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController

@RequestMapping("/api/usuarios")
public class userCtr {
    @Autowired
    userSV userSV;

    @GetMapping("/getUsers")
    public List<userET> getUsers(){
        return userSV.getUser();
    }
}
