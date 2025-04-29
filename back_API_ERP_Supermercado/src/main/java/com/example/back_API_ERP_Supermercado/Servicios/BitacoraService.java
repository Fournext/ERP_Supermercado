package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Repositorio.BitacoraRepositorio;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.BitacoraDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BitacoraService {
    @Autowired
    private BitacoraRepositorio bitacoraRepository;

    public void cargarBitacora(String username, String ip, String fecha, String descripcion) {
        bitacoraRepository.cargarBitacora(username, ip, fecha, descripcion);
    }

    public List<BitacoraDTO> obtenerBitacoras() {
        List<Object[]> resultados = bitacoraRepository.obtenerBitacoras();
        List<BitacoraDTO> bitacoras = new ArrayList<>();

        for (Object[] fila : resultados) {
            BitacoraDTO b = new BitacoraDTO();
            b.setId((Integer) fila[0]);
            b.setUsername((String) fila[1]);
            b.setIp((String) fila[2]);
            b.setFecha((String) fila[3]);
            b.setDescripcion((String) fila[4]);
            bitacoras.add(b);
        }

        return bitacoras;
    }
}
