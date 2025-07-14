import 'package:flutter/material.dart';
import '../models/categoria_model.dart';
import '../services/categoria_service.dart';
import 'package:login/screens/ProductListScreen.dart';

class CategoriaScreen extends StatefulWidget {
  const CategoriaScreen({super.key});

  @override
  State<CategoriaScreen> createState() => _CategoriaScreenState();
}

class _CategoriaScreenState extends State<CategoriaScreen> {
  final CategoriaService _categoriaService = CategoriaService();
  List<Categoria> _categorias = [];
  List<Categoria> _categoriasFiltradas = [];
  final TextEditingController _searchController = TextEditingController();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _cargarCategorias();
  }

  Future<void> _cargarCategorias() async {
    try {
      final categorias = await _categoriaService.listarCategorias();
      setState(() {
        _categorias = categorias;
        _categoriasFiltradas = categorias;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error al cargar categorías: $e')));
    }
  }

  void _filtrarCategorias(String query) {
    setState(() {
      _categoriasFiltradas =
          _categorias
              .where(
                (cat) => cat.nombre.toLowerCase().contains(query.toLowerCase()),
              )
              .toList();
    });
  }

  void _mostrarFormularioBottomSheet({Categoria? categoria}) {
    final nombreController = TextEditingController(
      text: categoria?.nombre ?? '',
    );
    final esEdicion = categoria != null;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            top: 20,
            left: 20,
            right: 20,
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                esEdicion ? 'Actualizar Categoría' : 'Registrar Categoría',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: nombreController,
                decoration: const InputDecoration(
                  labelText: 'Nombre',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Cancelar'),
                  ),
                  ElevatedButton(
                    onPressed: () async {
                      final nombre = nombreController.text.trim();
                      if (nombre.isEmpty) return;

                      try {
                        if (esEdicion) {
                          await _categoriaService.actualizarCategoria(
                            Categoria(
                              idCategoria: categoria.idCategoria,
                              nombre: nombre,
                            ),
                          );
                        } else {
                          await _categoriaService.crearCategoria(
                            Categoria(nombre: nombre),
                          );
                        }

                        Navigator.pop(context);
                        _cargarCategorias();

                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              esEdicion
                                  ? 'Categoría actualizada correctamente'
                                  : 'Categoría registrada correctamente',
                            ),
                          ),
                        );
                      } catch (e) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(
                          context,
                        ).showSnackBar(SnackBar(content: Text('Error: $e')));
                      }
                    },
                    child: const Text('Guardar'),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  DataRow _buildDataRow(Categoria categoria, bool isEven) {
    return DataRow(
      color: MaterialStateProperty.resolveWith<Color?>((
        Set<MaterialState> states,
      ) {
        return isEven ? Colors.grey.shade100 : null;
      }),
      cells: [
        DataCell(Text('${categoria.idCategoria}')),
        DataCell(Text(categoria.nombre)),
        const DataCell(Text('Activo')),
        DataCell(
          IconButton(
            icon: const Icon(Icons.edit, color: Colors.blue),
            onPressed:
                () => _mostrarFormularioBottomSheet(categoria: categoria),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gestión de Categorías'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(
                builder: (context) => const ProductListScreen(),
              ),
              (route) => false, // Esto limpia el historial
            );
          },
        ),
      ),

      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child:
            _isLoading
                ? const Center(child: CircularProgressIndicator())
                : Column(
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _searchController,
                            decoration: const InputDecoration(
                              hintText: 'Buscar categoría...',
                              border: OutlineInputBorder(),
                            ),
                            onChanged: _filtrarCategorias,
                          ),
                        ),
                        const SizedBox(width: 10),

                        TextButton.icon(
                          onPressed: () => _mostrarFormularioBottomSheet(),
                          icon: const Icon(Icons.add, color: Colors.white),
                          label: const Text(
                            'Registrar',
                            style: TextStyle(color: Colors.white),
                          ),
                          style: TextButton.styleFrom(
                            backgroundColor: Colors.blue,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Expanded(
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: DataTable(
                          headingRowColor: MaterialStateColor.resolveWith(
                            (states) => Colors.grey.shade300,
                          ),
                          columns: const [
                            DataColumn(label: Text('IDENTIFICADOR')),
                            DataColumn(label: Text('NOMBRE')),
                            DataColumn(label: Text('ESTADO')),
                            DataColumn(label: Text('ACCIONES')),
                          ],
                          rows: List.generate(
                            _categoriasFiltradas.length,
                            (index) => _buildDataRow(
                              _categoriasFiltradas[index],
                              index.isEven,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
      ),
    );
  }
}
