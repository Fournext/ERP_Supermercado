package com.example.back_API_ERP_Supermercado.Servicios;


import com.example.back_API_ERP_Supermercado.Repositorio.LoteRepositorio;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.LoteDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.LoteGETDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoteService {
    @Autowired
    private LoteRepositorio loteRepository;

    public void insertarLote(LoteDTO dto) {
        loteRepository.insertarLote(
                dto.getStock(),
                dto.getStock_minimo(),
                dto.getCod_repisa(),
                dto.getNombre_estado(),
                dto.getDescripcion_producto(),
                dto.getCod_almacen(),
                dto.getCosto_unitario(),
                dto.getFecha_caducidad()
        );
    }

    public void actualizarLote(LoteDTO dto) {
        loteRepository.actualizarLote(
                dto.getId_lote(),
                dto.getStock(),
                dto.getStock_minimo(),
                dto.getCod_repisa(),
                dto.getNombre_estado(),
                dto.getDescripcion_producto(),
                dto.getCod_almacen(),
                dto.getCosto_unitario(),
                dto.getFecha_caducidad()
        );
    }

    public List<LoteGETDTO> obtenerLotes() {
        return loteRepository.obtenerLotes();
    }

    public Optional<LoteGETDTO> obtenerLotePorId(Integer id) {
        return loteRepository.obtenerLotePorId(id);
    }

    public void eliminarLote(Integer idLote) {
        loteRepository.eliminarLote(idLote);
    }

}

