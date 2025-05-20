package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.DetalleBoletaEntrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleBoletaEntradaRepositorio extends JpaRepository<DetalleBoletaEntrada,Integer> {
    //aqui iran las consultas personalizadas

    @Query(value="select * from obtener_detalles_boleta(:idBoletaEntrada)",nativeQuery = true)
    List<DetalleBoletaEntrada> obtenerDetallesByIdBoletaEntrada(@Param("idBoletaEntrada") Integer idBoletaEntrada);

}
