class Categoria {
  int? idCategoria;
  String nombre;

  Categoria({this.idCategoria, required this.nombre});

  factory Categoria.fromJson(Map<String, dynamic> json) {
    return Categoria(
      idCategoria: json['id_categoria'], // clave exacta del backend
      nombre: json['nombre'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id_categoria': idCategoria,
      'nombre': nombre,
    };
  }
}
