package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "carrito")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Carrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_carrito")
    private Integer idCarrito;
    @Column(name="total")
    private BigDecimal total;
    @Column(name="estado")
    private String estado;
    @Column(name="fecha")
    private LocalDate fecha;
    @Column(name="id_cliente")
    private Integer idCliente;

}
