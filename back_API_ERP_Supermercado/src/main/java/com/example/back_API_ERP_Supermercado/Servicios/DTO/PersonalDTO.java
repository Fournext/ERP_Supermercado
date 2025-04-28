package com.example.back_API_ERP_Supermercado.Servicios.DTO;

import java.util.Date;

public class PersonalDTO {
    private Integer idPersonal;
    private Date fecha;
    private String motivo;

    public Integer getIdPersonal() {
        return idPersonal;
    }

    public void setIdPersonal(Integer idPersonal) {
        this.idPersonal = idPersonal;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}

