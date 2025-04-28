package com.example.back_API_ERP_Supermercado.Repositorio;


import com.example.back_API_ERP_Supermercado.Entidad.Almacen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlmacenRepositorio extends JpaRepository<Almacen, Integer> {
}
