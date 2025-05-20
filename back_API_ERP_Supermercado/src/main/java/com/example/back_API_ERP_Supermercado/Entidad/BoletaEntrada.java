package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="boleta_entrada")
public class BoletaEntrada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_boleta")
    private Integer idBoleta;
    @Column(name="fecha")
    private LocalDate fecha;
    @Column(name="descripcion")
    private String descripcion;
    @Column(name="id_boleta_compra")
    private Integer idBoletaCompra;
    @Column(name="estado")
    private String estado;
    @Column(name="id_personal")
    private Integer idPersonal;
}
