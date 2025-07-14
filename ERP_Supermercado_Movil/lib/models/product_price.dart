class ProductPrice {
  final int idPrecio;
  final double precioUnitario;
  final int idProducto;

  ProductPrice({
    required this.idPrecio,
    required this.precioUnitario,
    required this.idProducto,
  });

  factory ProductPrice.fromJson(Map<String, dynamic> json) {
    return ProductPrice(
      idPrecio: json['idPrecio'],
      precioUnitario: (json['precioUnitario'] as num).toDouble(),
      idProducto: json['idProducto'],
    );
  }
}
