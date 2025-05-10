package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Proveedor;
import com.example.back_API_ERP_Supermercado.Servicios.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedor")
public class ProveedorController {
    @Autowired
    private ProveedorService proveedorService;

    @GetMapping("/listar")
    public List<Proveedor> listaProveedores(){
        return this.proveedorService.getProveedores();
    }

    @GetMapping("/getProveedor")
    public ResponseEntity<?> obtenerProveedorById(@RequestParam Integer id){
        try{
            Proveedor proveedor=this.proveedorService.obtenerProveedor(id);
            return ResponseEntity.status(HttpStatus.OK).body(proveedor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo obtener el proveedor con id:"+id);
        }
    }
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarProveedor(@RequestBody Proveedor proveedor){
        try{
            Proveedor proveedor1=this.proveedorService.insertarProveedor(proveedor);
            return ResponseEntity.status(HttpStatus.OK).body(proveedor1);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo registrar el proveedor");
        }
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarProveedor(@RequestParam Integer id,@RequestBody Proveedor proveedorActualizado){
        try{
            Proveedor proveedor1=this.proveedorService.editarProveedor(id,proveedorActualizado);
            return ResponseEntity.status(HttpStatus.OK).body(proveedor1);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo actualizar el proveedor con id:"+id);
        }
    }
}
