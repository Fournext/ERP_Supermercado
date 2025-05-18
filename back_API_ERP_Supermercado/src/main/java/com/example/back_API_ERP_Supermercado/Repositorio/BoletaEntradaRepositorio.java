package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.BoletaEntrada;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BoletaEntradaRepositorio extends JpaRepository<BoletaEntrada,Integer> {
    //aqui iran las consultas personalizadas

    @Modifying
    @Transactional
    @Query(value="CALL eliminar_boleta_entrada_completa(:idBoletaEntrada)",nativeQuery = true)
    void eliminarBoleta(@Param("idBoletaEntrada") Integer idBoletaEntrada);

}
