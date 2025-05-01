package com.example.back_API_ERP_Supermercado.Controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.back_API_ERP_Supermercado.Entidad.Turno;
import com.example.back_API_ERP_Supermercado.Servicios.TurnoServicio;

@RestController
@RequestMapping("/api/turno")
public class TurnoControlador {

    @Autowired
    private TurnoServicio turnoService;
    @GetMapping("/listar")
    public List<Turno> listarTurnos() {
        return turnoService.listarTurnos();
    }

    @PostMapping("/crear")
    public Turno crearTurno(@RequestBody Turno turno) {
        return turnoService.crearTurno(turno);
    }

    @PutMapping("/actualizar/{id}")
    public Turno actualizarTurno(@PathVariable Integer id, @RequestBody Turno turno) {
        return turnoService.actualizarTurno(id, turno);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminarTurno(@PathVariable Integer id) {
        turnoService.eliminarTurno(id);
    }

    @GetMapping("/{id}")
    public Turno buscarTurno(@PathVariable Integer id) {
        return turnoService.findById(id);
    }

}
