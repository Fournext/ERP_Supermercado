import 'package:flutter/material.dart';
import 'package:login/models/product.dart';
import 'package:login/services/product_service.dart';

class ProductScreen extends StatefulWidget {
  const ProductScreen({super.key});

  @override
  State<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends State<ProductScreen> {
  late Future<List<Map<String, dynamic>>> _productosConStock = Future.value([]);

  @override
  void initState() {
    super.initState();
    _productosConStock = ProductService().getProductosConStock();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Listado de Productos")),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _productosConStock,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          if (!snapshot.hasData || snapshot.data == null || snapshot.data!.isEmpty) {
            return const Center(child: Text('No hay productos disponibles.'));
          }

          var productosConStock = snapshot.data!;

          // 🔥 Ordenar por idProducto de menor a mayor
          productosConStock.sort((a, b) {
            final pA = a['producto'] as Product;
            final pB = b['producto'] as Product;
            return pA.idProducto.compareTo(pB.idProducto);
          });

          return SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: DataTable(
                columnSpacing: 12,
                columns: const [
                  DataColumn(label: Text('ID')),
                  DataColumn(label: Text('Código')),
                  DataColumn(label: Text('Descripción')),
                  DataColumn(label: Text('Marca')),
                  DataColumn(label: Text('Categoría')),
                  DataColumn(label: Text('Tipo')),
                  DataColumn(label: Text('Precio')),
                  DataColumn(label: Text('Stock')),
                ],
                rows: productosConStock.map((item) {
                  final p = item['producto'] as Product;
                  final stock = item['stock'] as int;

                  return DataRow(cells: [
                    DataCell(Text(p.idProducto.toString())),
                    DataCell(Text(p.codigo)),
                    DataCell(Text(p.descripcion)),
                    DataCell(Text(p.marca ?? '')),
                    DataCell(Text(p.categoria ?? '')),
                    DataCell(Text(p.tipoProducto ?? '')),
                    DataCell(Text('\$${p.precio.toStringAsFixed(2)}')),
                    DataCell(Text(stock.toString())),
                  ]);
                }).toList(),
              ),
            ),
          );
        },
      ),
    );
  }
}
