package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "boleta_salida")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoletaSalida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_boleta;
    private String fecha;
    private Integer id_lote;
    private Integer id_personal;
}
