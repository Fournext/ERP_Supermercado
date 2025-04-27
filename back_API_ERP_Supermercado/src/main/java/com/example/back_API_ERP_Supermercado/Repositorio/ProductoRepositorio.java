package com.example.back_API_ERP_Supermercado.Repositorio;

import com.example.back_API_ERP_Supermercado.Entidad.Producto;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.ProductoConPrecioInformacionDTO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductoRepositorio extends JpaRepository<Producto,Integer> {
    //aqui vamos a poner las consultas personalizadas
    @Query(value="SELECT * FROM producto WHERE codigo=:codigo",nativeQuery = true)
    Optional<Producto> buscarProductoSQL(@Param("codigo") String codigo);

    @Query(value="SELECT * FROM producto WHERE id_marca=:id",nativeQuery = true)
    List<Producto> buscarProductosPorMarca(@Param("id") Integer id);

    @Query(value="SELECT * FROM producto WHERE id_categoria=:id",nativeQuery = true)
    List<Producto> buscarProductosPorCategorias(@Param("id") Integer id);

    @Query(value="SELECT * FROM obtener_productos()",nativeQuery = true)
    List<Object[]> obtenerProductosInformacion();

    //esto traera el producto con toda la informacion con precio
    @Query(value = "SELECT * FROM obtener_info_productos()",nativeQuery = true)
    List<ProductoConPrecioInformacionDTO> obtenerProductosConPrecio();

    @Procedure(procedureName = "insertar_producto_con_precio")
    void insertarProductoConPrecio(
            @Param("p_codigo") String codigo,
            @Param("p_descripcion") String descripcion,
            @Param("p_id_marca") Integer idMarca,
            @Param("p_id_categoria") Integer idCategoria,
            @Param("p_id_tipo") Integer idTipo,
            @Param("p_precio_unitario") BigDecimal precioUnitario
    );



    @Procedure(procedureName = "editar_producto_y_precio")
    void editarProductoYPrecio(@Param("p_id_producto") Integer idProducto,
                               @Param("p_codigo") String codigo,
                               @Param("p_descripcion") String descripcion,
                               @Param("p_id_marca") Integer idMarca,
                               @Param("p_id_categoria") Integer idCategoria,
                               @Param("p_id_tipo") Integer idTipo,
                               @Param("p_precio_unitario") BigDecimal precio);



}
