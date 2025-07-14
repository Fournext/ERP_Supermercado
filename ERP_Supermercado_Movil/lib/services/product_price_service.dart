import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product_price.dart';
import '../Core/utils/config.dart';

class ProductPriceService {
  final String _baseUrl = Config.baseUrl;

  Future<List<ProductPrice>> getAllPrices() async {
    final url = Uri.parse('$_baseUrl/precio/listar'); // Asegurate que el endpoint existe

    final response = await http.get(url);
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((item) => ProductPrice.fromJson(item)).toList();
    } else {
      throw Exception('Error al obtener precios: ${response.statusCode}');
    }
  }

  Future<ProductPrice?> getPriceByProductId(int idProducto) async {
    final prices = await getAllPrices();
    return prices.firstWhere(
      (price) => price.idProducto == idProducto,
      orElse: () => throw Exception('Precio no encontrado para el producto $idProducto'),
    );
  }
}
