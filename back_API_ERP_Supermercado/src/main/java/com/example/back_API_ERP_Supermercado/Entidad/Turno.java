package com.example.back_API_ERP_Supermercado.Entidad;

import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "turno")
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_turno;

    private String descripcion;
    private LocalTime horaEntrada;
    private LocalTime horaSalida;
}
