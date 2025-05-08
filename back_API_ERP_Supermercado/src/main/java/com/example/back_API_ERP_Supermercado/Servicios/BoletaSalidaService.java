package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Repositorio.BoletaSalidaRepositorio;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BoletaSalidaDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BoletaSalidaGETDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BoletaSalidaService {
    @Autowired
    private BoletaSalidaRepositorio boletaSalidaRepository;

    public void insertarBoletaSalida(BoletaSalidaDTO dto) {
        boletaSalidaRepository.insertarBoletaSalida(
                dto.getId_lote(),
                dto.getId_personal(),
                dto.getFecha()
        );
    }

    public void eliminarBoletaSalida(Integer idBoleta) {
        boletaSalidaRepository.eliminarBoletaSalida(idBoleta);
    }

    public List<BoletaSalidaGETDTO> obtenerBoletasSalida() {
        return boletaSalidaRepository.obtenerBoletasSalida();
    }

    public Optional<BoletaSalidaGETDTO> obtenerBoletaSalidaPorId(Integer id) {
        return boletaSalidaRepository.obtenerBoletaSalidaPorId(id);
    }
}
