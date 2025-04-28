package com.example.back_API_ERP_Supermercado.Controlador;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.back_API_ERP_Supermercado.Entidad.Personal;
import com.example.back_API_ERP_Supermercado.Servicios.PersonalServicio;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.PersonalDTO;

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

    @PostMapping("/eliminarPersonalByEstado")
    public ResponseEntity<Map<String, String>> eliminarPersonalByEstado(@RequestBody PersonalDTO personalDTO) {
        personalService.eliminarPersonalByEstado(personalDTO);
        return ResponseEntity.ok(Map.of("mensaje", "Permiso asignado correctamente"));
    }

}
