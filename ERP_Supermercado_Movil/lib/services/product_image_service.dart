import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product_image.dart';
import '../Core/utils/config.dart';
import 'package:collection/collection.dart';


class ProductImageService {
  final String _baseUrl = Config.baseUrl;

  Future<List<ProductImage>> getAllImages() async {
    final url = Uri.parse('$_baseUrl/imagenes/listar');

    final response = await http.get(url);
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((item) => ProductImage.fromJson(item)).toList();
    } else {
      throw Exception('Error al obtener imágenes: ${response.statusCode}');
    }
  }

  Future<ProductImage?> getImageByProductId(int idProducto) async {
    final images = await getAllImages();
    return images.firstWhereOrNull((img) => img.idProducto == idProducto);
  }
}
