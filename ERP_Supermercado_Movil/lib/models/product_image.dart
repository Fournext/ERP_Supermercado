class ProductImage {
  final int idImagen;
  final String url;
  final int idProducto;

  ProductImage({
    required this.idImagen,
    required this.url,
    required this.idProducto,
  });

  factory ProductImage.fromJson(Map<String, dynamic> json) {
    return ProductImage(
      idImagen: json['idImagen'],
      url: json['url'],
      idProducto: json['idProducto'],
    );
  }
}
