package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="producto_imagen")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductoImagen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_imagen")
    private Integer idImagen;
    private String url;
    @Column(name="id_producto")
    private Integer idProducto;
}
