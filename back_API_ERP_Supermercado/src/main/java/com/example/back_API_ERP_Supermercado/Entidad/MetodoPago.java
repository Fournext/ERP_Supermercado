package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="metodo_pago")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MetodoPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_metodo")
    private Integer metodoPagoId;
    @Column(name="nombre")
    private String nombre;
}
