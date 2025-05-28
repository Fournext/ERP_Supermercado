package com.example.back_API_ERP_Supermercado.Servicios.DTO;

import com.example.back_API_ERP_Supermercado.Entidad.BoletaRecepcion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoletaRecepcionDTO {
    private Integer idBoleta;
    private String descripcion;
    private Integer puntaje;
    private Integer idCliente;
    private Integer idFactura;
    private String nombreCliente;

    public static BoletaRecepcionDTO from(BoletaRecepcion boleta, String nombreCliente) {
        return new BoletaRecepcionDTO(
                boleta.getIdBoleta(),
                boleta.getDescripcion(),
                boleta.getPuntaje(),
                boleta.getIdCliente(),
                boleta.getIdFactura(),
                nombreCliente
        );
    }
}
