package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.BoletaRecepcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoletaRecepcionRepositorio extends JpaRepository<BoletaRecepcion,Integer> {
    boolean existsByIdFactura(Integer idFactura);
    Optional<BoletaRecepcion> findByIdFactura(Integer idFactura);
}
