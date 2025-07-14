import 'package:flutter/material.dart';
import '../models/marca_model.dart';
import '../services/marca_service.dart';
import 'package:login/screens/ProductListScreen.dart';

class MarcaScreen extends StatefulWidget {
  const MarcaScreen({super.key});

  @override
  State<MarcaScreen> createState() => _MarcaScreenState();
}

class _MarcaScreenState extends State<MarcaScreen> {
  final MarcaService _marcaService = MarcaService();
  List<Marca> _marcas = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _cargarMarcas();
  }

  Future<void> _cargarMarcas() async {
    try {
      final marcas = await _marcaService.listarMarcas();
      setState(() {
        _marcas = marcas;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error al cargar marcas: \$e')));
    }
  }

  void _mostrarFormularioRegistro(BuildContext context) {
    final TextEditingController nombreController = TextEditingController();

    showDialog(
      context: context,
      builder:
          (context) => Dialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Registrar Marca',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.deepPurple,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: nombreController,
                    decoration: InputDecoration(
                      labelText: 'Nombre de la marca',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
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
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        onPressed: () async {
                          final nombre = nombreController.text.trim();
                          if (nombre.isNotEmpty) {
                            final nueva = Marca(nombre: nombre);
                            final exito = await _marcaService.crearMarca(nueva);
                            if (exito) {
                              Navigator.pop(context);
                              _cargarMarcas();
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Marca registrada exitosamente',
                                  ),
                                ),
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Error al registrar la marca'),
                                ),
                              );
                            }
                          }
                        },
                        child: const Text('Registrar'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
    );
  }

  void _mostrarFormularioEditar(BuildContext context, Marca marca) {
    final TextEditingController nombreController = TextEditingController(
      text: marca.nombre,
    );

    showDialog(
      context: context,
      builder:
          (context) => Dialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Actualizar Marca',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.deepPurple,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: nombreController,
                    decoration: InputDecoration(
                      labelText: 'Nombre de la marca',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
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
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        onPressed: () async {
                          final nuevoNombre = nombreController.text.trim();
                          if (nuevoNombre.isNotEmpty) {
                            final actualizada = Marca(
                              idMarca: marca.idMarca,
                              nombre: nuevoNombre,
                            );
                            final exito = await _marcaService.actualizarMarca(
                              actualizada,
                            );
                            if (exito) {
                              Navigator.pop(context);
                              _cargarMarcas();
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Marca actualizada exitosamente',
                                  ),
                                ),
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Error al actualizar la marca'),
                                ),
                              );
                            }
                          }
                        },
                        child: const Text('Guardar cambios'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Gestión de Marcas"),
        backgroundColor: Colors.deepPurple,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(
                builder: (context) => const ProductListScreen(),
              ),
              (route) => false,
            );
          },
        ),
      ),

      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Buscar marca...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      prefixIcon: const Icon(Icons.search),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                ElevatedButton.icon(
                  onPressed: () => _mostrarFormularioRegistro(context),
                  icon: const Icon(Icons.add),
                  label: const Text("Registrar"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Text(
              "Gestión de Marcas",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            _isLoading
                ? const Center(child: CircularProgressIndicator())
                : Expanded(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: DataTable(
                      columns: const [
                        DataColumn(label: Text("IDENTIFICADOR")),
                        DataColumn(label: Text("NOMBRE")),
                        DataColumn(label: Text("ESTADO")),
                        DataColumn(label: Text("ACCIONES")),
                      ],
                      rows:
                          _marcas.map((marca) {
                            return DataRow(
                              cells: [
                                DataCell(Text(marca.idMarca?.toString() ?? '')),
                                DataCell(Text(marca.nombre)),
                                const DataCell(Text("Activo")),
                                DataCell(
                                  IconButton(
                                    icon: const Icon(
                                      Icons.edit,
                                      color: Colors.blue,
                                    ),
                                    onPressed:
                                        () => _mostrarFormularioEditar(
                                          context,
                                          marca,
                                        ),
                                  ),
                                ),
                              ],
                            );
                          }).toList(),
                    ),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}
