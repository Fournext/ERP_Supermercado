package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "encargado_inventario")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EncargadoInventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_encargado")
    private Integer idEncargado;
    @Column(name="nombre")
    private String nombre;
    @Column(name="correo_notificacion")
    private String correoNotificacion;
    @Column(name="id_personal")
    private Integer idPersonal;
}
