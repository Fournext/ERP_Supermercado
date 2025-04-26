package com.example.back_API_ERP_Supermercado.Servicios;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.back_API_ERP_Supermercado.Entidad.Rol;
import com.example.back_API_ERP_Supermercado.Repositorio.RolRepositorio;

@Service
public class RolServicio {

        @Autowired
    private RolRepositorio rolRepository;

    public List<Rol> listartRoles() {
        return rolRepository.findAll();
    }

    public Rol crearRol(Rol rol) {
        return rolRepository.save(rol);
    }

    public Rol findById(Integer id) {
        Optional<Rol> rol = rolRepository.findById(id);;
        return rol.orElse(null);
    }

    public Rol actualizarRol(Integer id, Rol rol) {
        if (rolRepository.existsById(id)) {
            rol.setId_rol(id);;
            return rolRepository.save(rol);
        }
        return null;
    }

    public void eliminarRol(Integer id) {
        if (rolRepository.existsById(id)) {
            rolRepository.deleteById(id);
        }
    }
}
