package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "categoria")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Categorias {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_categoria;
    private String nombre;

}
