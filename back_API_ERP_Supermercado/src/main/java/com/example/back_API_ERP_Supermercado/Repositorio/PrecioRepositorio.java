package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.Precio;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface PrecioRepositorio extends JpaRepository<Precio,Integer> {
    //aqui iran las consultas personalizadas
    @Modifying
    @Transactional
    @Query(value = "CALL actualizar_precio_producto(:idProducto, :nuevoPrecio)", nativeQuery = true)
    void actualizarPrecioProducto(@Param("idProducto") Integer idProducto,
                                  @Param("nuevoPrecio") BigDecimal nuevoPrecio);

}
