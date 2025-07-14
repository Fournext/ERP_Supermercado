import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../models/product.dart';
import '../models/product_image.dart';
import '../services/product_service.dart';
import '../services/product_image_service.dart';
import '../services/lote_service.dart';
import 'ProductDetailScreen.dart';
import 'package:login/screens/DashboardScreen.dart';

class ProductListScreen extends StatefulWidget {
  const ProductListScreen({super.key});

  @override
  State<ProductListScreen> createState() => _ProductListScreenState();
}

class _ProductListScreenState extends State<ProductListScreen> {
  late Future<List<_ProductoConImagen>> _productosConImagen;
  List<_ProductoConImagen> _productosFiltrados = [];
  String _busqueda = '';

  @override
  void initState() {
    super.initState();
    _productosConImagen = _cargarProductosConImagen();
  }

  Future<List<_ProductoConImagen>> _cargarProductosConImagen() async {
    final productos = await ProductService().getProductos();
    final imagenes = await ProductImageService().getAllImages();

    final lista = await Future.wait(productos.map((producto) async {
      final imagen = imagenes.firstWhere(
        (img) => img.idProducto == producto.idProducto,
        orElse: () => ProductImage(idImagen: 0, url: '', idProducto: producto.idProducto),
      );
      final stock = await LoteService().getStockByDescripcionProducto(producto.descripcion);
      final stockMinimo = await LoteService().getStockMinByDescripcionProducto(producto.descripcion);
      return _ProductoConImagen(
        producto: producto,
        imagenUrl: imagen.url,
        stock: stock,
        stockMinimo: stockMinimo,
      );
    }));

    setState(() {
      _productosFiltrados = lista;
    });

    return lista;
  }

  void _verDetalleProducto(Product producto, int stock, int stockMinimo) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ProductDetailScreen(
          producto: producto,
          stock: stock,
          stockMinimo: stockMinimo,
        ),
      ),
    );
  }

  void _filtrarProductos(String query) {
    setState(() {
      _busqueda = query;
    });
  }

  Color _colorStock(int stock, int stockMinimo) {
    if (stock <= stockMinimo) {
      return Colors.red.shade700;
    } else if (stock <= stockMinimo + 5) {
      return Colors.amber.shade700;
    } else {
      return Colors.blue.shade700;
    }
  }

  Future<void> _actualizarStock() async {
    await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const BarcodeScannerScreen()),
    );
    setState(() {
      _productosConImagen = _cargarProductosConImagen();
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Catálogo de Productos", style: TextStyle(color: Colors.black)),
        backgroundColor: Colors.white,
        iconTheme: const IconThemeData(color: Colors.black),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const DashboardScreen()),
              (route) => false,
            );
          },
        ),
      ),
      body: FutureBuilder<List<_ProductoConImagen>>(
        future: _productosConImagen,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final productos = snapshot.data ?? [];
          final productosFiltrados = productos.where((p) {
            final query = _busqueda.toLowerCase();
            final data = [
              p.producto.descripcion,
              p.producto.marca ?? '',
              p.producto.categoria ?? '',
              p.producto.precio.toString(),
            ].join(' ').toLowerCase();
            return data.contains(query);
          }).toList();

          return Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: _actualizarStock,
                      child: const Text('Actualizar Stock', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                    const SizedBox(width: 10),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blueGrey,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () {
                        Navigator.pushNamed(context, '/productScreen');
                      },
                      child: const Text('Listar', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                TextField(
                  decoration: InputDecoration(
                    hintText: 'Buscar producto...',
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onChanged: _filtrarProductos,
                ),
                const SizedBox(height: 12),
                Expanded(
                  child: productosFiltrados.isEmpty
                      ? const Center(child: Text('No hay productos disponibles.'))
                      : GridView.builder(
                          itemCount: productosFiltrados.length,
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                            childAspectRatio: screenWidth < 400 ? 0.85 : 0.75,
                          ),
                          itemBuilder: (context, index) {
                            final p = productosFiltrados[index];
                            return GestureDetector(
                              onTap: () => _verDetalleProducto(p.producto, p.stock, p.stockMinimo),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                curve: Curves.easeInOut,
                                child: Hero(
                                  tag: 'producto_${p.producto.idProducto}',
                                  child: Card(
                                    elevation: 4,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                    clipBehavior: Clip.antiAlias,
                                    child: Stack(
                                      children: [
                                        Positioned.fill(
                                          child: CachedNetworkImage(
                                            imageUrl: p.imagenUrl,
                                            fit: BoxFit.cover,
                                            placeholder: (context, url) => Container(color: Colors.grey[300], child: const Center(child: CircularProgressIndicator())),
                                            errorWidget: (context, url, error) => const Icon(Icons.broken_image),
                                          ),
                                        ),
                                        Positioned.fill(
                                          child: Container(
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                begin: Alignment.bottomCenter,
                                                end: Alignment.topCenter,
                                                colors: [Colors.black.withOpacity(0.7), Colors.transparent],
                                              ),
                                            ),
                                          ),
                                        ),
                                        Positioned(
                                          bottom: 80,
                                          left: 0,
                                          right: 0,
                                          child: Padding(
                                            padding: const EdgeInsets.symmetric(horizontal: 8),
                                            child: Text(
                                              p.producto.descripcion,
                                              maxLines: 2,
                                              textAlign: TextAlign.center,
                                              overflow: TextOverflow.ellipsis,
                                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                                            ),
                                          ),
                                        ),
                                        Positioned(
                                          bottom: 47,
                                          left: 0,
                                          right: 0,
                                          child: Center(
                                            child: Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                              decoration: BoxDecoration(
                                                color: _colorStock(p.stock, p.stockMinimo),
                                                borderRadius: BorderRadius.circular(30),
                                                boxShadow: const [
                                                  BoxShadow(color: Colors.black45, blurRadius: 6, offset: Offset(0, 3)),
                                                ],
                                              ),
                                              child: Text('Stock: ${p.stock}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
                                            ),
                                          ),
                                        ),
                                        Positioned(
                                          bottom: 8,
                                          left: 0,
                                          right: 0,
                                          child: Center(
                                            child: Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                              decoration: BoxDecoration(
                                                color: Colors.green.shade700,
                                                borderRadius: BorderRadius.circular(30),
                                                boxShadow: const [
                                                  BoxShadow(color: Colors.black45, blurRadius: 6, offset: Offset(0, 3)),
                                                ],
                                              ),
                                              child: Text(
                                                p.producto.precio != null ? '\$${p.producto.precio!.toStringAsFixed(2)}' : '--',
                                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class BarcodeScannerScreen extends StatefulWidget {
  const BarcodeScannerScreen({super.key});

  @override
  State<BarcodeScannerScreen> createState() => _BarcodeScannerScreenState();
}

class _BarcodeScannerScreenState extends State<BarcodeScannerScreen> {
  bool _codigoProcesado = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Escanear código')),
      body: MobileScanner(
        onDetect: (capture) async {
          if (!_codigoProcesado) {
            _codigoProcesado = true;
            final code = capture.barcodes.first.rawValue ?? '';
            if (code.isNotEmpty) {
              await _procesarCodigo(context, code);
              Navigator.pop(context);
            }
          }
        },
      ),
    );
  }

  Future<void> _procesarCodigo(BuildContext context, String codigo) async {
    try {
      final descripcion = await ProductService().getDescripcionPorCodigo(codigo);
      if (descripcion == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Producto con código $codigo no encontrado.')),
        );
        return;
      }

      final lotes = await LoteService().getLotes();
      final loteEncontrado = lotes.firstWhere(
        (lote) => lote.descripcionProducto?.toLowerCase() == descripcion.toLowerCase(),
        orElse: () => throw Exception('No se encontró un lote para $descripcion'),
      );

      int nuevoStock = loteEncontrado.stock + 1;
      await LoteService().actualizarStockPorCodigo(codigo, lotes, nuevoStock);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Stock incrementado en +1 para $descripcion (Nuevo stock: $nuevoStock)')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }
}

class _ProductoConImagen {
  final Product producto;
  final String imagenUrl;
  final int stock;
  final int stockMinimo;

  _ProductoConImagen({required this.producto, required this.imagenUrl, required this.stock, required this.stockMinimo});
}
