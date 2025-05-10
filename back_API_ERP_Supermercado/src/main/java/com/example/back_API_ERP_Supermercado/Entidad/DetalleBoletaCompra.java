package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@Table(name="detalle_boleta_compra")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DetalleBoletaCompra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_detalle")
    private Integer idDetalleCompra;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name="costo_unitario")
    private BigDecimal costoUnitario;

    @Column(name="id_boleta_compra")
    private Integer idBoletaCompra;

    @Column(name="id_producto")
    private Integer idProducto;
}
