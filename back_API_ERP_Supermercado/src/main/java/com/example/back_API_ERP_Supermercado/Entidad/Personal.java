package com.example.back_API_ERP_Supermercado.Entidad;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "personal")
public class Personal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_personal;

    private String nombre;
    private String apellido;
    private String carnet;

    @Column(name="fecha_creacion", nullable = true, updatable = false)
    private LocalDateTime fecha_creacion;

    @Column(name="id_rol")
    private Integer idRol;

    @Column(name="id_turno")
    private Integer idTurno;

    @Column(name="id_usuario")
    private long idUsuario;

    @PrePersist
    protected void onCreate() {
        fecha_creacion = LocalDateTime.now();
    }
}
