package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.ProductoImagen;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductoImagenRepositorio extends JpaRepository<ProductoImagen,Integer> {

    @Modifying
    @Transactional
    @Query(value = "CALL actualizar_url_imagen(:idImagen, :url)", nativeQuery = true)
    void actualizarUrlImagen(@Param("idImagen") Integer idImagen, @Param("url") String url);
}
