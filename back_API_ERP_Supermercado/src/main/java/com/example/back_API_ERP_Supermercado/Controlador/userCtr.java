package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.userET;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.back_API_ERP_Supermercado.Servicios.userSV;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController

@RequestMapping("/api/usuarios")
public class userCtr {
    @Autowired
    userSV userSV;

    @GetMapping("/getUsers")
    public List<userET> getUsers(){
        return userSV.getUser();
    }

    @GetMapping("/getUser/{username}")
    public ResponseEntity<userET> getByUsername(@PathVariable String username) {
        Optional<userET> user = userSV.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/rol/{username}")
    public ResponseEntity<Map<String, String>> obtenerRol(@PathVariable String username) {
        try {
            String rol = userSV.obtenerRolPorUsername(username);
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("rol", rol);
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener el rol: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
