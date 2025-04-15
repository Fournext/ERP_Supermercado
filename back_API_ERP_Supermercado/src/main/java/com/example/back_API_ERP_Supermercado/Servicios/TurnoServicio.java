package com.example.back_API_ERP_Supermercado.Servicios;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.back_API_ERP_Supermercado.Entidad.Turno;
import com.example.back_API_ERP_Supermercado.Repositorio.TurnoRepositorio;

@Service
public class TurnoServicio {

    @Autowired
    private TurnoRepositorio turnoRepository;

    public List<Turno> listarTurnos() {
        return turnoRepository.findAll();
    }

    public Turno crearTurno(Turno turno) {
        return turnoRepository.save(turno);
    }

    public Turno findById(Integer id) {
        Optional<Turno> turno = turnoRepository.findById(id);
        return turno.orElse(null);
    }

    public Turno actualizarTurno(Integer id, Turno turno) {
        if (turnoRepository.existsById(id)) {
            turno.setId_turno(id);
            return turnoRepository.save(turno);
        }
        return null;
    }

    public void eliminarTurno(Integer id) {
        if (turnoRepository.existsById(id)) {
            turnoRepository.deleteById(id);
        }
    }
}
