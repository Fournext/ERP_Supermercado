package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.BoletaSalida;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BoletaSalidaGETDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoletaSalidaRepositorio extends JpaRepository<BoletaSalida, Integer> {
    @Procedure(procedureName = "insertar_boleta_salida")
    void insertarBoletaSalida(Integer p_id_lote, Integer p_id_personal, String p_fecha);

    @Procedure(procedureName = "eliminar_boleta_salida")
    void eliminarBoletaSalida(Integer p_id_boleta);

    @Query(value = "SELECT * FROM obtener_boletas_salida()", nativeQuery = true)
    List<BoletaSalidaGETDTO> obtenerBoletasSalida();

    @Query(value = "SELECT * FROM obtener_boleta_salida(:id)", nativeQuery = true)
    java.util.Optional<BoletaSalidaGETDTO> obtenerBoletaSalidaPorId(Integer id);

}
