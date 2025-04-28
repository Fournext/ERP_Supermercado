package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Almacen;
import com.example.back_API_ERP_Supermercado.Repositorio.AlmacenRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlmacenService {
    @Autowired
    private AlmacenRepositorio almacenRepository;

    public Almacen crearAlmacen(Almacen almacen) {
        return almacenRepository.save(almacen);
    }

    public Almacen editarAlmacen(Integer id, Almacen almacenActualizado) {
        Optional<Almacen> almacenExistente = almacenRepository.findById(id);
        if (almacenExistente.isPresent()) {
            Almacen almacen = almacenExistente.get();
            almacen.setCodigo(almacenActualizado.getCodigo());
            almacen.setDimenciones(almacenActualizado.getDimenciones());
            return almacenRepository.save(almacen);
        } else {
            throw new RuntimeException("Almacén no encontrado con id " + id);
        }
    }

    public void eliminarAlmacen(Integer id) {
        almacenRepository.deleteById(id);
    }

    public Almacen obtenerAlmacen(Integer id) {
        return almacenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Almacén no encontrado con id " + id));
    }

    public List<Almacen> obtenerTodosLosAlmacenes() {
        return almacenRepository.findAll();
    }
}
