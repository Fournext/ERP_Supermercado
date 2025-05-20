package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Permiso;
import com.example.back_API_ERP_Supermercado.Repositorio.PermisoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PermisoService {
    @Autowired
    private PermisoRepositorio permisoRepository;

    public Permiso crear(Permiso permiso) {
        // Asegura que id_rol se está usando y no se ignora
        if (permiso.getIdRol() == null) {
            throw new RuntimeException("El campo id_rol no puede ser nulo.");
        }

        return permisoRepository.save(permiso);
    }


    public Permiso editar(Integer id, Permiso nuevo) {
        Permiso actual = permisoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado con ID: " + id));

        actual.setVista(nuevo.getVista());
        actual.setVer(nuevo.getVer());
        actual.setInsertar(nuevo.getInsertar());
        actual.setEditar(nuevo.getEditar());
        actual.setEliminar(nuevo.getEliminar());
        actual.setIdRol(nuevo.getIdRol());

        return permisoRepository.save(actual);
    }

    public List<Permiso> listarTodos() {
        return permisoRepository.findAll();
    }

    public Optional<Permiso> obtenerUno(Integer id) {
        return permisoRepository.findById(id);
    }

    public void eliminar(Integer id) {
        permisoRepository.deleteById(id);
    }

    public List<Permiso> listarPorRol(Integer idRol) {
        return permisoRepository.findByIdRol(idRol);
    }
}
