package com.example.back_API_ERP_Supermercado.Controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.back_API_ERP_Supermercado.Entidad.Rol;
import com.example.back_API_ERP_Supermercado.Servicios.RolServicio;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/rol")
public class RolControlador {
    @Autowired
    private RolServicio rolService;

    @GetMapping("/listar")
    public List<Rol> listarRoles() {
        return rolService.listartRoles();
    }

    @PostMapping("/crear")
    public Rol crearRol(@RequestBody Rol rol) {
        return rolService.crearRol(rol);
    }

    @PutMapping("/actualizar/{id}")
    public Rol actualizarRol(@PathVariable Integer id, @RequestBody Rol rol) {
        return rolService.actualizarRol(id, rol);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminarRol(@PathVariable Integer id) {
        rolService.eliminarRol(id);
    }

    @GetMapping("/{id}")
    public Rol buscarRol(@PathVariable Integer id) {
        return rolService.findById(id);
    }
    

}
