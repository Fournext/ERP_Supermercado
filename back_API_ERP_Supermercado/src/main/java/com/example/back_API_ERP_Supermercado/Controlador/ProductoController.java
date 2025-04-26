package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Entidad.Producto;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.ProductoConPrecioInformacionDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.ProductoEditarDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.ProductoInformacionDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.ProductoPrecioDTO;
import com.example.back_API_ERP_Supermercado.Servicios.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/producto")
public class ProductoController {
    @Autowired
    private ProductoService productoService;

    @GetMapping("/listar")
    public List<Producto> listaProducto(){
        return this.productoService.getProducto();
    }

    @GetMapping("/getProducto")
    public ResponseEntity<Producto> obtenerProductoByCodigo(@RequestParam String codigo){
        return this.productoService.getProductoByCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearProducto(@RequestBody Producto producto) {
        try {
            Producto nuevoProducto = productoService.crearProducto(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("No se pudo crear el producto: " + e.getMessage());
        }
    }



    @GetMapping("/getProductoByMarca")
    public ResponseEntity<?> getProductosPorMarca(@RequestParam Integer id) {
        try {
            List<Producto> productos = productoService.getProductoByMarca(id);
            if (productos.isEmpty()) {
                return ResponseEntity.status(404).body("No se encontraron productos para la marca con ID: " + id);
            }
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }


    @GetMapping("/getProductoByCategoria")
    public ResponseEntity<?> getProductosPorCategoria(@RequestParam Integer id) {
        try {
            List<Producto> productos = productoService.getProductoByCategoria(id);
            if (productos.isEmpty()) {
                return ResponseEntity.status(404).body("No se encontraron productos para la categoría con ID: " + id);
            }
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }

    @GetMapping("/productosConInformacion")
    public List<ProductoInformacionDTO> listarProductosInformacion() {
        return productoService.obtenerProductosConInformacion();
    }

    @GetMapping("/listarProductosPrecio")
    public ResponseEntity<?> listarProductosPrecio(){
        try {
            List<ProductoConPrecioInformacionDTO> productos = productoService.listarProductosConPrecio();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            // Log the error for debugging purposes
            e.printStackTrace();  // Or use a logger like Log4j or SLF4J

            // Return a generic error message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener la información de los productos.");
        }
    }

    @PostMapping("/crear_con_precio")
    public ResponseEntity<Map<String, String>> crearProductoConPrecio(@RequestBody ProductoPrecioDTO dto) {
        try {
            productoService.crearProductoConPrecio(dto);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Producto y precio insertados correctamente");
            return ResponseEntity.ok(response);  // Devuelve un JSON con un mensaje
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al insertar producto: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/editar")
    public ResponseEntity<Map<String, String>> editarProducto(@RequestBody ProductoEditarDTO dto) {
        try {
            productoService.actualizarProductoYPrecio(dto);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Producto y precio actualizados correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al actualizar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }




}
