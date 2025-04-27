package com.example.back_API_ERP_Supermercado.Servicios.DTO;

import java.math.BigDecimal;

public class ProductoConPrecioInformacionDTO {
    private Integer idProducto;
    private String codigo;
    private String descripcion;
    private String marca;
    private String categoria;
    private String tipo_producto;
    private BigDecimal precio;

    public ProductoConPrecioInformacionDTO(Integer idProducto, String codigo, String descripcion, String marca, String categoria, String tipo_producto, BigDecimal precio) {
        this.idProducto = idProducto;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.marca = marca;
        this.categoria = categoria;
        this.tipo_producto = tipo_producto;
        this.precio = precio;
    }

    public Integer getIdProducto() {
        return idProducto;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getMarca() {
        return marca;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getTipo_producto() {
        return tipo_producto;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public void setTipo_producto(String tipo_producto) {
        this.tipo_producto = tipo_producto;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }
}
