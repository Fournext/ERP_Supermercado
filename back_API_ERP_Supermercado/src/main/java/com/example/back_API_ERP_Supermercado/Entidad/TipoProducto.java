package com.example.back_API_ERP_Supermercado.Entidad;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="tipo_producto")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TipoProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo")
    private Integer idTipo;
    @Column(name="nombre")
    private String nombre;
}
