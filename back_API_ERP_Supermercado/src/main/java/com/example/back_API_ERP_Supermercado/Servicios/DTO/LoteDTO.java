package com.example.back_API_ERP_Supermercado.Servicios.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoteDTO {
    private Integer id_lote;
    private int stock;
    private int stock_minimo;
    private String cod_repisa;
    private String nombre_estado;
    private String descripcion_producto;
    private String cod_almacen;
    private BigDecimal costo_unitario;
    private String fecha_caducidad;
}

