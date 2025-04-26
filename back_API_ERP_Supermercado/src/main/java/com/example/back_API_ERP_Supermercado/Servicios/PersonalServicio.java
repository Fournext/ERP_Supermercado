package com.example.back_API_ERP_Supermercado.Servicios;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.back_API_ERP_Supermercado.Entidad.Personal;
import com.example.back_API_ERP_Supermercado.Repositorio.PersonalRepositorio;

import jakarta.transaction.Transactional;

@Service
public class PersonalServicio {

    @Autowired
    private PersonalRepositorio personalRepositorio;

    public List<Personal> listarPersonal() {
        return personalRepositorio.findAll();
    }

    public Personal crearPersonal(Personal personal) {
        return personalRepositorio.save(personal);
    }

    public Optional<Personal> findById(Integer id) {
        return personalRepositorio.findById(id);
    }
    public Personal actualizarPersonal(Integer id, Personal personal) {
        if (personalRepositorio.existsById(id)) {
            personal.setId_personal(id);
            return personalRepositorio.save(personal);
        }
        return null;
    }

    @Transactional
    public void eliminarPersonal(Integer id) {
        if (personalRepositorio.existsById(id)) {
            personalRepositorio.deleteById(id);
        }
    }
}
