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
@Table(name="boleta_recepcion")
public class BoletaRecepcion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_boleta")
    private Integer idBoleta;
    @Column(name="descripcion")
    private String descripcion;
    @Column(name="puntaje")
    private Integer puntaje;
    @Column(name="id_cliente")
    private Integer idCliente;
    @Column(name="id_factura")
    private Integer idFactura;
}
