package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Marca;
import com.example.back_API_ERP_Supermercado.Repositorio.MarcaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarcaService {
    @Autowired
    private MarcaRepositorio marcaRepositorio;

    public Marca crearMarca(Marca marca){
        return this.marcaRepositorio.save(marca);
    }

    public List<Marca> getMarca(){
        return marcaRepositorio.findAll();
    }

    public Optional<Marca> getMarcaByName(String nombre){
        return marcaRepositorio.buscarMarcaSQL(nombre);
    }

    public void actualizarNombre(Marca marca) {
        marcaRepositorio.editarMarca(marca.getId_marca(), marca.getNombre());
    }
}
