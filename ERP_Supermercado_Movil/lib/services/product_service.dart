import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:login/services/lote_service.dart';
import '../models/product.dart';
import '../Core/utils/config.dart';

class ProductService {
  final String _baseUrl = Config.baseUrl;

  Future<List<Product>> getProductos() async {
    final url = Uri.parse('$_baseUrl/producto/listarProductosPrecio');

    final response = await http.get(url);
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((item) => Product.fromJson(item)).toList();
    } else {
      throw Exception('Error al cargar productos: ${response.statusCode}');
    }
  }

  Future<List<Map<String, dynamic>>> getProductosConStock() async {
    final lotes = await LoteService().getLotes();
    final productos = await getProductos();

    return productos.map((producto) {
      final stock = LoteService().obtenerStockPorDescripcion(producto.descripcion, lotes);
      return {
        'producto': producto,
        'stock': stock,
      };
    }).toList();
  }

  Future<String?> getDescripcionPorCodigo(String codigo) async {
    final productos = await getProductos();
    final producto = productos.where((p) => p.codigo == codigo).isNotEmpty
        ? productos.firstWhere((p) => p.codigo == codigo)
        : null;
    return producto?.descripcion;
  }

}
