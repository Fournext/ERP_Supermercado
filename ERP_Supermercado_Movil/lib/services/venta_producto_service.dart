import 'dart:convert';
import 'package:http/http.dart' as http;
import '../Core/utils/config.dart';
import '../models/venta_producto_dia_model.dart';

class VentaProductoService {
  final String baseUrl = Config.baseUrl;

  Future<List<VentaProductoDia>> obtenerVentasPorFecha({
    required String inicio,
    required String fin,
  }) async {
    print(inicio);
    print(fin);
    final url = Uri.parse('$baseUrl/factura/listar-ventas-productos-dia?inicio=$inicio&fin=$fin');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((item) => VentaProductoDia.fromJson(item)).toList();
    } else {
      throw Exception('Error al obtener ventas por producto');
    }
  }
}
