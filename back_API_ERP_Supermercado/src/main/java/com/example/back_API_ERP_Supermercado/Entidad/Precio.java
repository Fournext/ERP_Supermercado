package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@Table(name="precio")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Precio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_precio")
    private Integer idPrecio;
    @Column(name="precio_unitario")
    private BigDecimal precioUnitario;

    @Column(name="id_producto")
    private Integer idProducto;
}
