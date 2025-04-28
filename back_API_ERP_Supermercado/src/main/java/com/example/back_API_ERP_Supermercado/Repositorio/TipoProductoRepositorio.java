package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.TipoProducto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TipoProductoRepositorio extends JpaRepository<TipoProducto,Integer> {
    //aqui iran las consultas personalizadas

    @Modifying
    @Transactional
    @Query(value = "CALL actualizar_nombre_tipo_producto(:idTipo, :nuevoNombre)", nativeQuery = true)
    void actualizarNombreTipoProducto(@Param("idTipo") Integer idTipo,
                                      @Param("nuevoNombre") String nuevoNombre);
}
