package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "lote")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Lote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_lote;
    private Integer stock;
    private Integer stock_minimo;
    private Integer id_repisa;
    private Integer id_estado;
    private Integer id_producto;
    private Integer id_almacen;
    private Integer costo_unitario;
    private String fecha_caducidad;
}
