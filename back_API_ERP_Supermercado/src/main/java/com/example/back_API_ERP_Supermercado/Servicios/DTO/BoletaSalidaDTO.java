package com.example.back_API_ERP_Supermercado.Servicios.DTO;

import lombok.Data;

@Data
public class BoletaSalidaDTO {
    private Integer id_lote;
    private Integer id_personal;
    private String fecha;
}
