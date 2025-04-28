package com.example.back_API_ERP_Supermercado.Servicios;


import com.example.back_API_ERP_Supermercado.Entidad.ProductoImagen;
import com.example.back_API_ERP_Supermercado.Repositorio.ProductoImagenRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoImagenService {
    @Autowired
    private ProductoImagenRepositorio productoImagenRepositorio;

    public List<ProductoImagen> listartImagenes() {
        return this.productoImagenRepositorio.findAll();
    }

    public ProductoImagen insertarImangen(ProductoImagen imagen) {

        return this.productoImagenRepositorio.save(imagen);
    }

    public void actualizarUrl(Integer idImagen, String nuevaUrl) {
        this.productoImagenRepositorio.actualizarUrlImagen(idImagen, nuevaUrl);
    }

    public void eliminarImagen(Integer id) {
        if (this.productoImagenRepositorio.existsById(id)) {
            this.productoImagenRepositorio.deleteById(id);
        }
    }
}
