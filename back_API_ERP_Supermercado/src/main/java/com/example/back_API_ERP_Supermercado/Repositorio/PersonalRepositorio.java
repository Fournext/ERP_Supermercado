package com.example.back_API_ERP_Supermercado.Repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.back_API_ERP_Supermercado.Entidad.Personal;

public interface PersonalRepositorio extends JpaRepository<Personal, Integer> {
    
}
