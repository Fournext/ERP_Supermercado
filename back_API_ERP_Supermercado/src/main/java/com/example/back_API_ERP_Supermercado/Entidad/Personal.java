package com.example.back_API_ERP_Supermercado.Entidad;

import java.time.LocalDate;

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
    private LocalDate fecha_creacion;
    
    @ManyToOne
    @JoinColumn(name = "id_rol")
    private Rol id_rol;

    @ManyToOne
    @JoinColumn(name = "id_turno")
    private Turno id_turno;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private userET id_usuario;
}
