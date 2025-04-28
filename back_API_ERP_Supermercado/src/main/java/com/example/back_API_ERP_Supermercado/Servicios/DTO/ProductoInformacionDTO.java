package com.example.back_API_ERP_Supermercado.Servicios.DTO;

public class ProductoInformacionDTO {
        private Integer idProducto;
        private String codigo;
        private String descripcion;
        private String marcaNombre;
        private String categoriaNombre;
        private String tipoNombre;

    public ProductoInformacionDTO(Integer idProducto, String codigo, String descripcion, String marcaNombre, String categoriaNombre, String tipoNombre) {
        this.idProducto = idProducto;
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.marcaNombre = marcaNombre;
        this.categoriaNombre = categoriaNombre;
        this.tipoNombre = tipoNombre;
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

    public String getMarcaNombre() {
        return marcaNombre;
    }

    public String getCategoriaNombre() {
        return categoriaNombre;
    }

    public String getTipoNombre() {
        return tipoNombre;
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

    public void setMarcaNombre(String marcaNombre) {
        this.marcaNombre = marcaNombre;
    }

    public void setCategoriaNombre(String categoriaNombre) {
        this.categoriaNombre = categoriaNombre;
    }

    public void setTipoNombre(String tipoNombre) {
        this.tipoNombre = tipoNombre;
    }
}
