package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CarritoRepositorio extends JpaRepository<Carrito,Integer> {

    @Query(value="SELECT * FROM obtener_carrito_cliente(:idCliente)",nativeQuery = true)
    Carrito obtenerCarritoPorCliente(@Param("idCliente")Integer idCliente);
}
