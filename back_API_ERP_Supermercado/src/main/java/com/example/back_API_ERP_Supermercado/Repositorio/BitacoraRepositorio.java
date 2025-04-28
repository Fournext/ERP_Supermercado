package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.Bitacora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BitacoraRepositorio extends JpaRepository<Bitacora,Integer> {
    @Procedure(procedureName = "cargarbitacora")
    void cargarBitacora(String p_username, String p_ip, String p_fecha, String p_descripcion);

    @Query(value = "SELECT * FROM ObtenerBitacoras()", nativeQuery = true)
    List<Object[]> obtenerBitacoras();
}
