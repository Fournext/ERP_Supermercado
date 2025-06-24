package com.example.back_API_ERP_Supermercado.Servicios.DTO;

import java.time.LocalDate;

public class MontoVentaDiarioDTO {
    private String fecha;
    private Double total;

    public MontoVentaDiarioDTO(){

    }

    public MontoVentaDiarioDTO(String fecha, Double total){
        this.fecha=fecha;
        this.total=total;
    }

    public String getFecha() {
        return fecha;
    }

    public Double getTotal() {
        return total;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}
