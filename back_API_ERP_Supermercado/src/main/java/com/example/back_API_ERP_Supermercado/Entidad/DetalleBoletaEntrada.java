package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="detalle_boleta_entrada")
public class DetalleBoletaEntrada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_boleta")
    private Integer idBoleta;
    @Column(name="cantidad")
    private Integer cantidad;
    @Column(name="id_boleta_entrada")
    private Integer idBoletaEntrada;
    @Column(name="id_producto")
    private Integer idProducto;
    @Column(name="cantidad_comprada")
    private Integer CantidadComprada;
    @Column(name="costo_unitario")
    private BigDecimal costoUnitario;
    @Column(name="id_lote")
    private Integer idLote;
}
