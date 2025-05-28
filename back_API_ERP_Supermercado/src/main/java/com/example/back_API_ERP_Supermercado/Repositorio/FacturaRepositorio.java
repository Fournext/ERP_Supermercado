package com.example.back_API_ERP_Supermercado.Repositorio;


import com.example.back_API_ERP_Supermercado.Entidad.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacturaRepositorio extends JpaRepository<Factura,Integer> {

@Query(value="SELECT * FROM obtener_factura_por_cliente(:idCliente)",nativeQuery = true)
    List<Factura> obtenerFacturasPorCliente(@Param("idCliente")Integer idCliente);

}
