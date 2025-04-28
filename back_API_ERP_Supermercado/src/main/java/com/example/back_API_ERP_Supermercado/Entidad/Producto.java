package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="producto")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProducto;

    private String codigo;
    private String descripcion;

    // Campos para almacenar los IDs de la Marca y la Categoría
    @Column(name="id_marca")
    private Integer idMarca;
    @Column(name="id_categoria")
    private Integer idCategoria;
    @Column(name="id_tipo")
    private Integer idTipo;
    @Column(name="id_precio")
    private Integer idPrecio;

}
