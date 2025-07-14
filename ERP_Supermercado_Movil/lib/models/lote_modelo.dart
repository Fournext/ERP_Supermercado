class Lote {
  final int idLote;
  final int stock;
  final int stockMinimo;
  final String? codRepisa;
  final String? nombreEstado;
  final String? descripcionProducto;
  final String? codAlmacen;
  final double? costoUnitario;
  final String? fechaCaducidad;

  Lote({
    required this.idLote,
    required this.stock,
    required this.stockMinimo,
    this.codRepisa,
    this.nombreEstado,
    this.descripcionProducto,
    this.codAlmacen,
    this.costoUnitario,
    this.fechaCaducidad,
  });

  factory Lote.fromJson(Map<String, dynamic> json) {
    return Lote(
      idLote: json['id_lote'],
      stock: json['stock'],
      stockMinimo: json['stock_minimo'],
      codRepisa: json['cod_repisa'],
      nombreEstado: json['nombre_estado'],
      descripcionProducto: json['descripcion_producto'],
      codAlmacen: json['cod_almacen'],
      costoUnitario: (json['costo_unitario'] as num?)?.toDouble() ?? 0.0,
      fechaCaducidad: json['fecha_caducidad'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id_lote': idLote,
      'stock': stock,
      'stock_minimo': stockMinimo,
      'cod_repisa': codRepisa,
      'nombre_estado': nombreEstado,
      'descripcion_producto': descripcionProducto,
      'cod_almacen': codAlmacen,
      'costo_unitario': costoUnitario,
      'fecha_caducidad': fechaCaducidad,
    };
  }
}

