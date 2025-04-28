package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Producto;
import com.example.back_API_ERP_Supermercado.Repositorio.ProductoRepositorio;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.ProductoConPrecioInformacionDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.ProductoEditarDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.ProductoInformacionDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.ProductoPrecioDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepositorio productoRepositorio;


    public Producto crearProducto(Producto producto) {
        return this.productoRepositorio.save(producto);
    }


    public List<Producto> getProducto(){
        return this.productoRepositorio.findAll();
    }

    public Optional<Producto> getProductoByCodigo(String codigo){
        return this.productoRepositorio.buscarProductoSQL(codigo);
    }

    public Optional<Producto> getProductoById(Integer id_producto){
        return this.productoRepositorio.findById(id_producto);
    }

    public List<Producto> getProductoByMarca(Integer id){
        return this.productoRepositorio.buscarProductosPorMarca(id);
    }
    public List<Producto> getProductoByCategoria(Integer id){
        return this.productoRepositorio.buscarProductosPorCategorias(id);
    }
    public List<ProductoInformacionDTO> obtenerProductosConInformacion() {
        List<Object[]> rows = this.productoRepositorio.obtenerProductosInformacion();

        return rows.stream()
                .map(r -> new ProductoInformacionDTO(
                        (Integer) r[0],
                        (String) r[1],
                        (String) r[2],
                        (String) r[3],
                        (String) r[4],
                        (String) r[5]
                )).toList();
    }
    public List<ProductoConPrecioInformacionDTO> listarProductosConPrecio() {
        return productoRepositorio.obtenerProductosConPrecio();
    }

    public void crearProductoConPrecio(ProductoPrecioDTO dto) {
        productoRepositorio.insertarProductoConPrecio(
                dto.getCodigo(),
                dto.getDescripcion(),
                dto.getIdMarca(),
                dto.getIdCategoria(),
                dto.getIdTipo(),
                dto.getPrecioUnitario()
        );
    }

    public void actualizarProductoYPrecio(ProductoEditarDTO dto) {
        productoRepositorio.editarProductoYPrecio(
                dto.getIdProducto(),
                dto.getCodigo(),
                dto.getDescripcion(),
                dto.getIdMarca(),
                dto.getIdCategoria(),
                dto.getIdTipo(),
                dto.getPrecioUnitario()
        );
    }


}
