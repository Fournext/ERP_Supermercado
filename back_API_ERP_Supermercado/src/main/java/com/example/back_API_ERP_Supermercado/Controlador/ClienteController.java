package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Carrito;
import com.example.back_API_ERP_Supermercado.Entidad.Cliente;
import com.example.back_API_ERP_Supermercado.Servicios.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarCliente(@RequestBody Cliente cliente){
        try{
            Cliente clienteActual=this.clienteService.registrarCliente(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(clienteActual);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/obtenerByUser")
    public ResponseEntity<?> obtenerCliente(@RequestParam Integer id){
        try{
            Cliente clienteActual=this.clienteService.obtenerClienteByUser(id);
            return ResponseEntity.status(HttpStatus.CREATED).body(clienteActual);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/getCliente/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Integer id) {
        Cliente cliente = clienteService.obtenerClientePorId(id);
        if (cliente != null) {
            return ResponseEntity.ok(cliente);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
