package com.example.back_API_ERP_Supermercado.Controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.back_API_ERP_Supermercado.Entidad.Personal;
import com.example.back_API_ERP_Supermercado.Servicios.PersonalServicio;

@RestController
@RequestMapping("/api/personal")
public class PersonalControlador {

    @Autowired
    private PersonalServicio personalService;

    @GetMapping("/listar")
    public List<Personal> listarPersonal() {
        return personalService.listarPersonal();
    }

    @GetMapping("/buscar/{id}")
    public ResponseEntity<Personal> buscarPersonal(@PathVariable Integer id) {
        return personalService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/crear")
    public Personal crearPersonal(@RequestBody Personal personal) {
        return personalService.crearPersonal(personal);
    }

    @PutMapping("/actualizar/{id}")
    public Personal actualizarPersonal(@PathVariable Integer id, @RequestBody Personal personal) {
        return personalService.actualizarPersonal(id, personal);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminarPersonal(@PathVariable Integer id) {
        personalService.eliminarPersonal(id);
    }

}
