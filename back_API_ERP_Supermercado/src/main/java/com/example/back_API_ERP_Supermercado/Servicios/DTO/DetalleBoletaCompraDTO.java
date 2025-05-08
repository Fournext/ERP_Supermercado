package com.example.back_API_ERP_Supermercado.Servicios.DTO;

import java.math.BigDecimal;

public class DetalleBoletaCompraDTO {
    private Integer idDetalle;
    private Integer idBoleta;
    private Integer cantidad;
    private BigDecimal costoUnitario;
    private Integer idProducto;
    private String codigoProducto;
    private String descripcion;

    public DetalleBoletaCompraDTO(Integer idDetalle,Integer idBoleta, Integer cantidad, BigDecimal costoUnitario, Integer idProducto, String codigoProducto, String descripcion) {
        this.idDetalle = idDetalle;
        this.idBoleta=idBoleta;
        this.cantidad = cantidad;
        this.costoUnitario = costoUnitario;
        this.idProducto = idProducto;
        this.codigoProducto = codigoProducto;
        this.descripcion = descripcion;
    }

    public DetalleBoletaCompraDTO() {
    }

    public void setIdBoleta(Integer idBoleta) {
        this.idBoleta = idBoleta;
    }

    public Integer getIdBoleta() {
        return idBoleta;
    }

    public void setIdDetalle(Integer idDetalle) {
        this.idDetalle = idDetalle;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public void setCostoUnitario(BigDecimal costoUnitario) {
        this.costoUnitario = costoUnitario;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public void setCodigoProducto(String codigoProducto) {
        this.codigoProducto = codigoProducto;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getIdDetalle() {
        return idDetalle;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public BigDecimal getCostoUnitario() {
        return costoUnitario;
    }

    public Integer getIdProducto() {
        return idProducto;
    }

    public String getCodigoProducto() {
        return codigoProducto;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
