package com.example.back_API_ERP_Supermercado.Servicios.DTO;

public class ActualizarImagenDTO {
    private Integer idImagen;
    private String url;

    // Getters y Setters
    public Integer getIdImagen() {
        return idImagen;
    }

    public void setIdImagen(Integer idImagen) {
        this.idImagen = idImagen;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}

