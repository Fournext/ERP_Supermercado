package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.Categorias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CategoriaRepositorio extends JpaRepository<Categorias,Integer> {
    //aqui podemos crear consultas personalizadas

    @Query(value="SELECT * FROM categoria WHERE nombre=:nombre",nativeQuery = true)
    Optional<Categorias>buscarCategoriaSQL(@Param("nombre") String nombre);

    @Procedure(procedureName = "actualizar_nombre_categoria")
    void editarNombreCategoria(@Param("p_id_categoria ")Integer idCategoria,
                               @Param("p_nuevo_nombre ")String nombre);
}
