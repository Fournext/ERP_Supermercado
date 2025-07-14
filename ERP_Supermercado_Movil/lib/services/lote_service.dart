import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:login/models/lote_modelo.dart';
import 'package:login/services/product_service.dart';
import '../Core/utils/config.dart';

class LoteService {
  final String _baseUrl = Config.baseUrl;

  Future<List<Lote>> getLotes() async {
    final url = Uri.parse('$_baseUrl/lote/getLotes');

    final response = await http.get(url);
    if (response.statusCode == 200) {
      if (response.body.isNotEmpty) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((item) => Lote.fromJson(item)).toList();
      } else {
        throw Exception('La respuesta del servidor está vacía al obtener lotes.');
      }
    } else {
      throw Exception('Error al cargar Lotes: ${response.statusCode}');
    }
  }

  Future<Lote> actualizarLote(Lote lote) async {
    final url = Uri.parse('$_baseUrl/lote/editar'); 
    final response = await http.put(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(lote.toJson()),
    );

    if (response.statusCode == 200) {
      if (response.body.isNotEmpty) {
        final data = jsonDecode(response.body);
        return Lote.fromJson(data);
      } else {
        // Si la respuesta está vacía, asumimos éxito y devolvemos el lote actualizado
        return lote;
      }
    } else {
      throw Exception('Error al actualizar Lote: ${response.statusCode}');
    }
  }


  Future<void> actualizarStockPorCodigo(String codigo, List<Lote> listaLotes, int nuevoStock) async {
    final String? descripcionProducto = await ProductService().getDescripcionPorCodigo(codigo);
    if (descripcionProducto == null) {
      throw Exception('No se encontró una descripción para el código $codigo');
    }

    final loteEncontrado = listaLotes.firstWhere(
      (lote) => lote.descripcionProducto?.toLowerCase() == descripcionProducto.toLowerCase(),
      orElse: () => throw Exception('No se encontró un lote con la descripción $descripcionProducto'),
    );

    // Crear una copia del lote con el nuevo stock
    final loteActualizado = Lote(
      idLote: loteEncontrado.idLote,
      stock: nuevoStock,
      stockMinimo: loteEncontrado.stockMinimo,
      codRepisa: loteEncontrado.codRepisa,
      nombreEstado: loteEncontrado.nombreEstado,
      descripcionProducto: loteEncontrado.descripcionProducto,
      codAlmacen: loteEncontrado.codAlmacen,
      costoUnitario: loteEncontrado.costoUnitario,
      fechaCaducidad: loteEncontrado.fechaCaducidad,
    );

    await actualizarLote(loteActualizado);
  }

  int obtenerStockPorDescripcion(String descripcionProducto, List<Lote> listaLotes) {
    for (var lote in listaLotes) {
      if (lote.descripcionProducto?.toLowerCase() == descripcionProducto.toLowerCase()) {
        return lote.stock;
      }
    }
    return 0;
  }

  int obtenerStockMinPorDescripcion(String descripcionProducto, List<Lote> listaLotes) {
    for (var lote in listaLotes) {
      if (lote.descripcionProducto?.toLowerCase() == descripcionProducto.toLowerCase()) {
        return lote.stockMinimo;
      }
    }
    return 0;
  }

  Future<int> getStockByDescripcionProducto(String descripcion) async {
    final lotes = await getLotes();
    return obtenerStockPorDescripcion(descripcion, lotes);
  }

  Future<int> getStockMinByDescripcionProducto(String descripcion) async {
    final lotes = await getLotes();
    return obtenerStockMinPorDescripcion(descripcion, lotes);
  }

  Future<List<String>> obtenerProductosConStockBajo() async {
    final lotes = await getLotes();
    final productosBajoStock = <String>[];

    for (var lote in lotes) {
      if (lote.stock < lote.stockMinimo) {
        productosBajoStock.add(
            '${lote.descripcionProducto ?? 'Producto desconocido'} (Stock: ${lote.stock}, Mínimo: ${lote.stockMinimo})');
      }
    }

    return productosBajoStock;
  }

}
