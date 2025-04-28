package com.example.back_API_ERP_Supermercado.Servicios.DTO;

import java.math.BigDecimal;

public class ProductoEditarDTO {
    private Integer idProducto;
    private String codigo;
    private String descripcion;
    private Integer idMarca;
    private Integer idCategoria;
    private Integer idTipo;
    private BigDecimal precioUnitario;

    public ProductoEditarDTO(Integer idProducto, String codigo, String descripcion, Integer idMarca, Integer idCategoria, Integer idTipo, BigDecimal precioUnitario) {
        this.idProducto = idProducto;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.idMarca = idMarca;
        this.idCategoria = idCategoria;
        this.idTipo = idTipo;
        this.precioUnitario = precioUnitario;
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

    public Integer getIdMarca() {
        return idMarca;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public Integer getIdTipo() {
        return idTipo;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
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

    public void setIdMarca(Integer idMarca) {
        this.idMarca = idMarca;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public void setIdTipo(Integer idTipo) {
        this.idTipo = idTipo;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
}
