class VentaProductoDia {
  final String fecha;
  final int idProducto;
  final String descripcion;
  final int cantidadTotal;

  VentaProductoDia({
    required this.fecha,
    required this.idProducto,
    required this.descripcion,
    required this.cantidadTotal,
  });

  factory VentaProductoDia.fromJson(Map<String, dynamic> json) {
    return VentaProductoDia(
      fecha: json['fecha'],
      idProducto: json['idProducto'],
      descripcion: json['descripcion'],
      cantidadTotal: json['cantidadTotal'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'fecha': fecha,
      'idProducto': idProducto,
      'descripcion': descripcion,
      'cantidadTotal': cantidadTotal,
    };
  }
}
