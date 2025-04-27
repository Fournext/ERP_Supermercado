package com.example.back_API_ERP_Supermercado.Repositorio;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import com.example.back_API_ERP_Supermercado.Entidad.Personal;

    public interface PersonalRepositorio extends JpaRepository<Personal, Integer> {
        @Procedure(procedureName = "insertar_asignacion_permiso")
        void eliminarPersonalByEstado(
                @Param("p_id_personal") Integer idPersonal,
                @Param("p_fecha") Date fecha,
                @Param("p_motivo") String motivo
    );
}
