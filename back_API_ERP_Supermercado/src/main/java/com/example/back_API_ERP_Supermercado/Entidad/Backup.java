package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "backup")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Backup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer id_usuario;
    private String nombre_archivo;
    private String fecha;
    private String tipo;
}
