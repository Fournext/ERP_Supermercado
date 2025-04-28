package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "sector")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Sector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_sector;
    private String nombre;
    private String ubicacion;
}
