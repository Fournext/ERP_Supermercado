package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@Table(name = "detalle_carrito_compra")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DetalleCarritoCompra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_detalle_carrito")
    private Integer idDetalleCarrito;

    @Column(name="cantidad")
    private Integer cantidad;

    @Column(name="precio")
    private BigDecimal precio;

    @Column(name="subtotal")
    private BigDecimal subtotal;

    @Column(name="id_producto")
    private Integer idProducto;

    @Column(name="id_carrito")
    private Integer idCarrito;

    @Column(name="url")
    private String url;

    @Column(name="descripcion")
    private String descripcion;
}
