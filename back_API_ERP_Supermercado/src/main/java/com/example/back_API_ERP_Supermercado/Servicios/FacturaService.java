package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Entidad.Factura;
import com.example.back_API_ERP_Supermercado.Repositorio.FacturaRepositorio;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.MontoVentaDiarioDTO;
import com.example.back_API_ERP_Supermercado.Servicios.DTO.VentasProductosDiaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class FacturaService {
    @Autowired
    private FacturaRepositorio facturaRepositorio;


    public Factura registrarFactura(Factura factura){
        return this.facturaRepositorio.save(factura);
    }

    public List<Factura> listarFacturas(){
        return this.facturaRepositorio.findAll();
    }

    public List<Factura> listarFacturasPorCliente(Integer id){
        return this.facturaRepositorio.obtenerFacturasPorCliente(id);
    }

    public List<VentasProductosDiaDTO> listaVentaProductosDia(LocalDate inicio, LocalDate fin){
        List<Object[]> resultados=this.facturaRepositorio.ventas_productos_por_dia(inicio,fin);
        return this.mapearVentas(resultados);
    }

    public List<MontoVentaDiarioDTO> listaMontoVentaDiaria(LocalDate inicio, LocalDate fin){
        List<Object[]> resultado=this.facturaRepositorio.ventasMontoDiario(inicio,fin);
        return this.mapearMontoVenta(resultado);
    }

    // mapear el resultado
    public List<VentasProductosDiaDTO> mapearVentas(List<Object[]> resultados) {
        List<VentasProductosDiaDTO> lista = new ArrayList<>();
        for (Object[] fila : resultados) {
            String fecha = fila[0].toString(); // 👈 aquí corregido
            Integer idProducto = ((Number) fila[1]).intValue();
            String descripcion = (String) fila[2];
            Integer cantidadTotal = ((Number) fila[3]).intValue();

            lista.add(new VentasProductosDiaDTO(fecha, idProducto, descripcion, cantidadTotal));
        }
        return lista;
    }

    public List<MontoVentaDiarioDTO> mapearMontoVenta(List<Object[]> resultados){
        List<MontoVentaDiarioDTO> lista= new ArrayList<>();
        for (Object[] fila :resultados){
            System.out.println("fila[0]: " + fila[0] + " (" + fila[0].getClass().getName() + ")");
            System.out.println("fila[1]: " + fila[1] + " (" + fila[1].getClass().getName() + ")");
            String fecha = fila[0].toString();
            Double total=((BigDecimal) fila[1]).doubleValue();
            lista.add(new MontoVentaDiarioDTO(fecha,total));
        }
        return lista;
    }
}
