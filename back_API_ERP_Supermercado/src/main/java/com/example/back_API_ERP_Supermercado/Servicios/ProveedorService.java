package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Proveedor;
import com.example.back_API_ERP_Supermercado.Repositorio.ProveedorRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {
    @Autowired
    private ProveedorRepositorio proveedorRepositorio;

    public Proveedor insertarProveedor(Proveedor proveedor){
        return this.proveedorRepositorio.save(proveedor);
    }

    public List<Proveedor> getProveedores(){
        return this.proveedorRepositorio.findAll();
    }

    public Proveedor editarProveedor(Integer id,Proveedor proveedorActualizado){
        Optional<Proveedor> proveedorExistente=this.proveedorRepositorio.findById(id);
        if(proveedorExistente.isPresent()){
            Proveedor proveedor=proveedorExistente.get();
            proveedor.setNombre(proveedorActualizado.getNombre());
            proveedor.setDireccion(proveedorActualizado.getDireccion());
            proveedor.setEstado(proveedorActualizado.getEstado());
            return this.proveedorRepositorio.save(proveedor);
        }else{
            throw new RuntimeException("Proveedor no encontrado con id: "+id);
        }
    }

    public Proveedor obtenerProveedor(Integer id){
        Optional<Proveedor> proveedor=this.proveedorRepositorio.findById(id);
        if(proveedor.isPresent()){
            return proveedor.get();
        }else {
            throw new RuntimeException("Proveedor no encontrado con id: "+id);
        }
    }
}
