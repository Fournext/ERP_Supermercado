package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_rol;
    private String nombre;

}
