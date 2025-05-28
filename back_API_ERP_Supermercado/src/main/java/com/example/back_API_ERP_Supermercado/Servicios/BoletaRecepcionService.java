package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.BoletaRecepcion;
import com.example.back_API_ERP_Supermercado.Entidad.Cliente;
import com.example.back_API_ERP_Supermercado.Repositorio.BoletaRecepcionRepositorio;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BoletaRecepcionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BoletaRecepcionService {
    @Autowired
    private BoletaRecepcionRepositorio boletaRecepcionRepositorio;
    @Autowired
    private ClienteService clienteService;

    public List<BoletaRecepcionDTO> obtenerTodas() {
        List<BoletaRecepcion> boletas = boletaRecepcionRepositorio.findAll();
        return boletas.stream().map(boleta -> {
            Cliente cliente = clienteService.obtenerClientePorId(boleta.getIdCliente());
            String nombreCompleto = cliente != null ? cliente.getNombreCliente() + " " + cliente.getNombreApellido() : "Desconocido";
            return BoletaRecepcionDTO.from(boleta, nombreCompleto);
        }).collect(Collectors.toList());
    }

    public Optional<BoletaRecepcionDTO> obtenerPorId(Integer id) {
        return boletaRecepcionRepositorio.findById(id).map(boleta -> {
            Cliente cliente = clienteService.obtenerClientePorId(boleta.getIdCliente());
            String nombreCompleto = cliente != null ? cliente.getNombreCliente() + " " + cliente.getNombreApellido() : "Desconocido";
            return BoletaRecepcionDTO.from(boleta, nombreCompleto);
        });
    }

    public BoletaRecepcion crear(BoletaRecepcion boleta) {
        return boletaRecepcionRepositorio.save(boleta);
    }

    public BoletaRecepcion actualizar(Integer id, BoletaRecepcion boletaActualizada) {
        return boletaRecepcionRepositorio.findById(id).map(boleta -> {
            boleta.setDescripcion(boletaActualizada.getDescripcion());
            boleta.setPuntaje(boletaActualizada.getPuntaje());
            boleta.setIdCliente(boletaActualizada.getIdCliente());
            boleta.setIdFactura(boletaActualizada.getIdFactura());
            return boletaRecepcionRepositorio.save(boleta);
        }).orElseThrow(() -> new RuntimeException("Boleta no encontrada con id " + id));
    }

    public void eliminar(Integer id) {
        boletaRecepcionRepositorio.deleteById(id);
    }

    public boolean existeValoracionPorFactura(Integer idFactura) {
        return boletaRecepcionRepositorio.existsByIdFactura(idFactura);
    }

    public Optional<BoletaRecepcion> obtenerPorIdFactura(Integer idFactura) {
        return boletaRecepcionRepositorio.findByIdFactura(idFactura);
    }


}
