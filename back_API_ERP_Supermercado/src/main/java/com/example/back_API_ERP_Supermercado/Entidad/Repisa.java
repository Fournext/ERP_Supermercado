package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "repisa")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Repisa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_repisa;
    private String codigo;
    private Integer capacidad;
    private Integer id_sector;
}
