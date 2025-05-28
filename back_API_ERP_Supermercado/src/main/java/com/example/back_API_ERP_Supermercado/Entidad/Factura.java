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
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "factura")
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_factura")
    private Integer idFactura;

    @Column(name="fecha")
    private LocalDate fecha;

    @Column(name="fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name="total")
    private BigDecimal total;

    @Column(name="id_carrito")
    private Integer idCarrito;

    @Column(name="id_Caja")
    private Integer idCaja;

    @Column(name="id_metodo_pago")
    private Integer idMetodoPago;

    @Column(name="id_cliente")
    private Integer idCliente;
}
