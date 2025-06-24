package com.example.back_API_ERP_Supermercado.Repositorio;


import com.example.back_API_ERP_Supermercado.Entidad.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;

@Repository
public interface FacturaRepositorio extends JpaRepository<Factura,Integer> {

@Query(value="SELECT * FROM obtener_factura_por_cliente(:idCliente)",nativeQuery = true)
    List<Factura> obtenerFacturasPorCliente(@Param("idCliente")Integer idCliente);

@Query(value="SELECT * FROM obtener_productos_vendidos_por_dia(:inicio, :fin)",nativeQuery = true)
List<Object[]> ventas_productos_por_dia(@Param("inicio")LocalDate inicio,@Param("fin")LocalDate fin);

@Query(value="SELECT * FROM obtener_total_vendido_por_dia(:inicio, :fin)",nativeQuery = true)
List<Object[]> ventasMontoDiario(@Param("inicio")LocalDate inicio,@Param("fin")LocalDate fin);


}
