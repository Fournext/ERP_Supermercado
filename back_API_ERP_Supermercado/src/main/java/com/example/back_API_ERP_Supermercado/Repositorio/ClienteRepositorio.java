package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepositorio extends JpaRepository<Cliente,Integer> {

    @Query(value = "SELECT * FROM obtener_cliente_por_usuario(:idUsuario)",nativeQuery = true)
    Cliente obtenerClienteByUsuario(@Param("idUsuario")Integer idCliente);
}
