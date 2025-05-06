package com.example.back_API_ERP_Supermercado.Servicios.DTO;

import java.math.BigDecimal;

public interface LoteGETDTO {
    Integer getId_lote();
    int getStock();
    int getStock_minimo();
    String getCod_repisa();
    String getNombre_estado();
    String getDescripcion_producto();
    String getCod_almacen();
    BigDecimal getCosto_unitario();
    String getFecha_caducidad();
}
