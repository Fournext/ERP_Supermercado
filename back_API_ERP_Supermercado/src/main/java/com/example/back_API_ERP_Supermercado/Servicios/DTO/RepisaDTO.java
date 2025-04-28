package com.example.back_API_ERP_Supermercado.Servicios.DTO;

import lombok.Data;

@Data
public class RepisaDTO {
    private Integer id_repisa;
    private String codigo;
    private Integer capacidad;
    private SectorDTO sector;
}
