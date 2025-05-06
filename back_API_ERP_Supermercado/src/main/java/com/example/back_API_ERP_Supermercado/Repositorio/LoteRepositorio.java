package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.Lote;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.LoteDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.LoteGETDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoteRepositorio extends JpaRepository<Lote,Integer> {
    @Procedure(procedureName = "insertar_lote")
    void insertarLote(
            Integer p_stock,
            Integer p_stock_minimo,
            String p_cod_repisa,
            String p_nombre_estado,
            String p_descripcion_producto,
            String p_cod_almacen,
            java.math.BigDecimal p_costo_unitario,
            String p_fecha_caducidad
    );

    @Procedure(procedureName = "actualizar_lote")
    void actualizarLote(
            Integer p_id_lote,
            Integer p_stock,
            Integer p_stock_minimo,
            String p_cod_repisa,
            String p_nombre_estado,
            String p_descripcion_producto,
            String p_cod_almacen,
            BigDecimal p_costo_unitario,
            String p_fecha_caducidad
    );

    @Query(value = "SELECT * FROM obtener_lotes()", nativeQuery = true)
    List<LoteGETDTO> obtenerLotes();

    @Query(value = "SELECT * FROM obtener_lote(:id)", nativeQuery = true)
    Optional<LoteGETDTO> obtenerLotePorId(Integer id);

    @Procedure(procedureName = "eliminar_lote")
    void eliminarLote(Integer p_id_lote);

}
