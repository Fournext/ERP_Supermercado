package com.example.back_API_ERP_Supermercado.Servicios.DTO;

public class VentasProductosDiaDTO {
    private String fecha;
    private Integer idProducto;
    private String descripcion;
    private Integer cantidadTotal;

    public VentasProductosDiaDTO(){}

    public VentasProductosDiaDTO(String fecha, Integer idProducto, String descripcion, Integer cantidadTotal){
        this.fecha=fecha;
        this.idProducto=idProducto;
        this.descripcion=descripcion;
        this.cantidadTotal=cantidadTotal;
    }

    public String getFecha() {
        return fecha;
    }

    public Integer getIdProducto() {
        return idProducto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Integer getCantidadTotal() {
        return cantidadTotal;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setCantidadTotal(Integer cantidadTotal) {
        this.cantidadTotal = cantidadTotal;
    }

}
