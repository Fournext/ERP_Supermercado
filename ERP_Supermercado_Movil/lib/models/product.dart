class Product {
  final int idProducto;
  final String codigo;
  final String descripcion;
  final String? marca;
  final String? categoria;
  final String? tipoProducto;
  final double precio;

  Product({
    required this.idProducto,
    required this.codigo,
    required this.descripcion,
    this.marca,
    this.categoria,
    this.tipoProducto,
    required this.precio,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      idProducto: json['idProducto'],
      codigo: json['codigo'] ?? '',
      descripcion: json['descripcion'] ?? '',
      marca: json['marca'],
      categoria: json['categoria'],
      tipoProducto: json['tipo_producto'],
      precio: (json['precio'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

