package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "permiso")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Permiso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_permiso;
    private String vista;
    private Boolean ver;
    private Boolean insertar;
    private Boolean editar;
    private Boolean eliminar;
    @Column(name = "id_rol")
    private Integer idRol;
}
