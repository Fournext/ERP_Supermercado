class Marca {
  final int? idMarca;
  final String nombre;

  Marca({this.idMarca, required this.nombre});

  factory Marca.fromJson(Map<String, dynamic> json) {
    return Marca(
      idMarca: json['id_marca'],
      nombre: json['nombre'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id_marca': idMarca,
      'nombre': nombre,
    };
  }
}
