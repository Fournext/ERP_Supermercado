package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.DetalleCarritoCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleCarritoCompraRepositorio extends JpaRepository<DetalleCarritoCompra,Integer> {

    @Query(value = "SELECT * FROM obtener_detalles_por_carrito(:idCarrito)",nativeQuery = true)
    List<DetalleCarritoCompra> listaDetalleCarritoById(@Param("idCarrito")Integer idCarrito);
}
