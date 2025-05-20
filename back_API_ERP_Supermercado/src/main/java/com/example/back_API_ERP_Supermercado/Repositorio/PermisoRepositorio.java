package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermisoRepositorio extends JpaRepository<Permiso, Integer> {
    List<Permiso> findByIdRol(Integer idRol); //
}
