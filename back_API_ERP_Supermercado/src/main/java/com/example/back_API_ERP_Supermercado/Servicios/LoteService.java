package com.example.back_API_ERP_Supermercado.Servicios;


import com.example.back_API_ERP_Supermercado.Entidad.EncargadoInventario;
import com.example.back_API_ERP_Supermercado.Entidad.Lote;
import com.example.back_API_ERP_Supermercado.Repositorio.EncargadoInventarioRepositorio;
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
    @Autowired
    private EncargadoInventarioRepositorio encargadoInventarioRepositorio;
    @Autowired
    private NotificacionService notificacionService;

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

    public void verificarYNotificarBajoStock(Integer id) {
        List<Lote> lotes = loteRepository.findAll();

        for (Lote lote : lotes) {
            if (lote.getStock() < lote.getStock_minimo()) {
                EncargadoInventario encargado = encargadoInventarioRepositorio.findById(id)  // puedes parametrizar esto
                        .orElseThrow(() -> new RuntimeException("Encargado no encontrado"));

                String asunto = "Alerta de inventario bajo";
                String cuerpo = "El lote '" + lote.getId_lote() + "' tiene solo "
                        + lote.getStock() + " unidades.";

                notificacionService.enviarCorreo(encargado.getCorreoNotificacion(), asunto, cuerpo);
            }
        }
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

