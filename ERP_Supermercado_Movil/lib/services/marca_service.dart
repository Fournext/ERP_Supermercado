import 'dart:convert';
import 'package:http/http.dart' as http;
import '../Core/utils/config.dart';
import '../models/marca_model.dart';

class MarcaService {
  final String baseUrl = Config.baseUrl;

  Future<List<Marca>> listarMarcas() async {
    final response = await http.get(Uri.parse('$baseUrl/marca/listar'));

    if (response.statusCode == 200) {
      final List<dynamic> body = json.decode(response.body);
      return body.map((e) => Marca.fromJson(e)).toList();
    } else {
      throw Exception('Error al listar marcas');
    }
  }

  Future<bool> crearMarca(Marca marca) async {
    final response = await http.post(
      Uri.parse('$baseUrl/marca/crear'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(marca.toJson()),
    );
    return response.statusCode == 201;
  }

  Future<bool> actualizarMarca(Marca marca) async {
    final response = await http.put(
      Uri.parse('$baseUrl/marca/actualizar'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(marca.toJson()),
    );
    return response.statusCode == 200;
  }

  Future<Marca?> obtenerPorNombre(String nombre) async {
    final response = await http.get(Uri.parse('$baseUrl/marca/getMarca?nombre=$nombre'));

    if (response.statusCode == 200) {
      return Marca.fromJson(json.decode(response.body));
    } else {
      return null;
    }
  }
}
