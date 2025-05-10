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
@Table(name="boleta_compra")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoletaCompra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_boleta")
    private Integer idBoletaCompra;

    @Column(name="costo_total")
    private BigDecimal costoTotal;

    @Column(name="fecha")
    private LocalDate fecha;

    @Column(name = "id_proveedor")
    private Integer idProveedor;

    @Column(name="id_metodo_pago")
    private Integer idMetodoPago;

    @Column(name="estado")
    private String estado;
}
