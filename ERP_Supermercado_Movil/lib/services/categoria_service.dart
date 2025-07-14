import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/categoria_model.dart';
import '../Core/utils/config.dart';

class CategoriaService {
  final String baseUrl = Config.baseUrl;

  Future<List<Categoria>> listarCategorias() async {
    final response = await http.get(Uri.parse('$baseUrl/categoria/listar'));

    print(' GET $baseUrl/categoria/listar');
    print(' STATUS: ${response.statusCode}');
    print(' BODY: ${response.body}');

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((json) => Categoria.fromJson(json)).toList();
    } else {
      throw Exception('Error al cargar las categorías');
    }
  }

  Future<Categoria?> obtenerCategoriaPorNombre(String nombre) async {
    final response = await http.get(Uri.parse('$baseUrl/categoria/getCategoria?nombre=$nombre'));

    print(' GET $baseUrl/categoria/getCategoria?nombre=$nombre');

    if (response.statusCode == 200) {
      return Categoria.fromJson(jsonDecode(response.body));
    } else if (response.statusCode == 404) {
      return null;
    } else {
      throw Exception('Error al obtener la categoría');
    }
  }

  Future<Categoria> crearCategoria(Categoria categoria) async {
    final response = await http.post(
      Uri.parse('$baseUrl/categoria/crear'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(categoria.toJson()),
    );

    print(' POST $baseUrl/categoria/crear');

    if (response.statusCode == 201) {
      return Categoria.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Error al crear la categoría');
    }
  }

  Future<String> actualizarCategoria(Categoria categoria) async {
    final response = await http.put(
      Uri.parse('$baseUrl/categoria/actualizar'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(categoria.toJson()),
    );

    print(' PUT $baseUrl/categoria/actualizar');

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['message'];
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Error al actualizar categoría');
    }
  }
}
