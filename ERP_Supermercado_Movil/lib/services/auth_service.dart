import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../Core/utils/config.dart'; // asegúrate de tener este import

class AuthService {
  final String _baseUrl = Config.baseUrl;

  Future<bool> login(String username, String password) async {
    final url = Uri.parse('$_baseUrl/auth/login');

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      );

      print('Status: ${response.statusCode}');
      print('Body: ${response.body}');

      print('🔐 Login request sent to: $url');
print('📤 Payload: ${jsonEncode({'username': username, 'password': '••••••'})}');
print('📥 Status Code: ${response.statusCode}');
print('📥 Headers: ${response.headers}');
print('📥 Response Body: ${response.body.isNotEmpty ? response.body : '[Empty Body]'}');


      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        if (data.containsKey('token')) {
          final token = data['token'];

          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('jwt_token', token);

          return true;
        } else {
          print("❌ No se encontró el token en la respuesta.");
          return false;
        }
      } else {
        print("❌ Error al hacer login: ${response.statusCode}");
        return false;
      }
    } catch (e) {
      print("❌ Excepción en login: $e");
      return false;
    }
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
  }
}
