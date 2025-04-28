package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MarcaRepositorio extends JpaRepository<Marca,Integer> {
    @Query(value="SELECT * FROM marca WHERE nombre=:nombre",nativeQuery = true)
    Optional<Marca> buscarMarcaSQL(@Param("nombre") String nombre);

    @Procedure(procedureName = "actualizar_nombre_marca")
    void editarMarca(@Param("p_id_marca") Integer idMarca,
                     @Param("p_nuevo_nombre") String nombre);
}
