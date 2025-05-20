package com.example.back_API_ERP_Supermercado.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "cliente")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_cliente")
    private Integer idCliente;

    @Column(name="nombre_cliente")
    private String nombreCliente;

    @Column(name="apellido_cliente")
    private String nombreApellido;

    @Column(name="carnet_cliente")
    private String carnetCliente;

    @Column(name="nit_cliente")
    private String nitCliente;

    @Column(name="direccion_cliente")
    private String direccionCliente;

    @Column(name="id_usuario")
    private Integer idUsuario;

    @Column(name="estado_cliente_id")
    private Integer estadoClienteId;


}
