package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.DetalleBoletaCompra;
import com.example.back_API_ERP_Supermercado.Repositorio.DetalleBoletaCompraRepositorio;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.DetalleBoletaCompraDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class DetalleBoletaCompraService {
    @Autowired
    private DetalleBoletaCompraRepositorio boletaCompraRepositorio;

    public DetalleBoletaCompra insertarDetalleBoletaCompra(DetalleBoletaCompra boletaCompra){
        return this.boletaCompraRepositorio.save(boletaCompra);
    }

    public DetalleBoletaCompra editarDetalleBoletaCompra(Integer id, DetalleBoletaCompra detalleBoletaCompraActualizado){
        Optional<DetalleBoletaCompra> detalleExistente=this.boletaCompraRepositorio.findById(id);
        if(detalleExistente.isPresent()){
            DetalleBoletaCompra detalleBoletaCompra1=detalleExistente.get();
            detalleBoletaCompra1.setCantidad(detalleBoletaCompraActualizado.getCantidad());
            detalleBoletaCompra1.setCostoUnitario(detalleBoletaCompraActualizado.getCostoUnitario());
            detalleBoletaCompra1.setIdProducto(detalleBoletaCompraActualizado.getIdProducto());
            return this.boletaCompraRepositorio.save(detalleBoletaCompra1);
        }else{
            throw new RuntimeException("Detalle de la boleta no encontrada");
        }
    }

    public void eliminarDetalleBoletaCompra(Integer id){
        this.boletaCompraRepositorio.deleteById(id);
    }

    public List<DetalleBoletaCompraDTO> obtenerDetalles(Integer idBoleta) {
        List<Object[]> resultados = boletaCompraRepositorio.obtenerDetallesBoletaRaw(idBoleta);

        return resultados.stream().map(r -> new DetalleBoletaCompraDTO(
                (Integer) r[0],
                (Integer) r[1],
                (Integer) r[2],
                (BigDecimal) r[3],
                (Integer) r[4],
                (String) r[5],
                (String) r[6]
        )).toList();
    }
}
