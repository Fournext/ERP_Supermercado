package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.userET;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface userRP extends JpaRepository<userET,Long> {
    Optional<userET> findByEmail(String email);
    Optional<userET> findByUsername(String username);
}
