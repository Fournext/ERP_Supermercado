package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Permiso;
import com.example.back_API_ERP_Supermercado.Servicios.PermisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permisos")
public class PermisoController {
    @Autowired
    private PermisoService permisoService;

    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody Permiso permiso) {
        try {
            Permiso creado = permisoService.crear(permiso);
            return ResponseEntity.ok(creado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear permiso: " + e.getMessage());
        }
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<?> editar(@PathVariable Integer id, @RequestBody Permiso permiso) {
        try {
            Permiso actualizado = permisoService.editar(id, permiso);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al editar permiso: " + e.getMessage());
        }
    }

    @GetMapping("/getPermisos")
    public ResponseEntity<List<Permiso>> listarTodos() {
        return ResponseEntity.ok(permisoService.listarTodos());
    }

    @GetMapping("/getPermiso/{id}")
    public ResponseEntity<?> obtenerUno(@PathVariable Integer id) {
        return permisoService.obtenerUno(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            permisoService.eliminar(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar permiso: " + e.getMessage());
        }
    }
    @GetMapping("/getPermisoRol/{id_rol}")
    public ResponseEntity<?> listarPorRol(@PathVariable Integer id_rol) {
        List<Permiso> permisos = permisoService.listarPorRol(id_rol);
        return ResponseEntity.ok(permisos);
    }


}
