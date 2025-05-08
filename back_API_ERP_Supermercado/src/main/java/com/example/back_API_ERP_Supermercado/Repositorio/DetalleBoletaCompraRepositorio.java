package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.DetalleBoletaCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleBoletaCompraRepositorio extends JpaRepository<DetalleBoletaCompra,Integer> {
        @Query(value = "SELECT * FROM obtener_detalles_boleta_compra(:idBoleta)", nativeQuery = true)
        List<Object[]> obtenerDetallesBoletaRaw(@Param("idBoleta") Integer idBoleta);

}
