package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Categorias;
import com.example.back_API_ERP_Supermercado.Repositorio.CategoriaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepositorio categoriaRepositorio;

    public Categorias crearCategoria(Categorias categoria){
        return this.categoriaRepositorio.save(categoria);
    }

    public List<Categorias> getCategorias(){
        return categoriaRepositorio.findAll();
    }

    public Optional<Categorias> getCategoriasByName(String nombre){
        return categoriaRepositorio.buscarCategoriaSQL(nombre);
    }

    public void actualizarNombreCategoria(Categorias categoria){
        this.categoriaRepositorio.editarNombreCategoria(categoria.getId_categoria(),categoria.getNombre());
    }

}
