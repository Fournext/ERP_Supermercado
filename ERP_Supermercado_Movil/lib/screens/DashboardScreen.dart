import 'package:flutter/material.dart';
import 'package:login/models/venta_producto_dia_model.dart';
import 'package:login/services/venta_producto_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:login/screens/ProductListScreen.dart';
import 'package:login/screens/MarcaScreen.dart';
import 'package:login/screens/categoria_Screen.dart';
import 'package:fl_chart/fl_chart.dart';
import '../services/lote_service.dart';



class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {

    @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      verificarStockMinimo();
    });
  }


  Future<void> verificarStockMinimo() async {
    final loteService = LoteService();
    final lotes = await loteService.getLotes();
    final productosBajoStock = lotes.where((l) => l.stock < l.stockMinimo).toList();

    if (productosBajoStock.isNotEmpty && mounted) {
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text("Productos con bajo stock"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: productosBajoStock.map((l) {
              return Text("${l.descripcionProducto} (Stock: ${l.stock}, Mínimo: ${l.stockMinimo})");
            }).toList(),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text("Cerrar"),
            ),
          ],
        ),
      );
    }
  }


  int _selectedIndex = 0;
  String? _selectedSubMenu;

  DateTime _fechaInicio = DateTime.now().subtract(const Duration(days: 7));
  DateTime _fechaFin = DateTime.now();
  List<VentaProductoDia> _ventas = [];
  bool _cargando = false;

  final Map<String, List<String>> _menuStructure = {
    "Dashboard": [],
    "Productos": ["Categoría", "Marca"],
  };
  

  Future<void> _cargarVentasPorProducto() async {
    setState(() => _cargando = true);
    try {
      final service = VentaProductoService();
      final ventas = await service.obtenerVentasPorFecha(
        inicio: _fechaInicio.toIso8601String().substring(0, 10),
        fin: _fechaFin.toIso8601String().substring(0, 10),
      );

      setState(() {
        _ventas = ventas;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      setState(() => _cargando = false);
    }
  }

  Widget _buildFiltroFechas() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Seleccione el rango de fechas", style: TextStyle(fontSize: 16)),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildFechaSelector("Fecha de inicio", _fechaInicio, (nuevaFecha) {
                setState(() => _fechaInicio = nuevaFecha);
              }),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildFechaSelector("Fecha final", _fechaFin, (nuevaFecha) {
                setState(() => _fechaFin = nuevaFecha);
              }),
            ),
            const SizedBox(width: 16),
            ElevatedButton(
              onPressed: _cargarVentasPorProducto,
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white, // Color del texto
                backgroundColor: Colors.deepPurple, // Color de fondo
              ),
              child: const Text("Graficar"),
              
            ),
          ],
        ),
      ],
    );
  }
  
  Widget _buildFechaSelector(String label, DateTime fecha, Function(DateTime) onSeleccion) {
    return InkWell(
      onTap: () async {
        final DateTime? picked = await showDatePicker(
          context: context,
          initialDate: fecha,
          firstDate: DateTime(2020),
          lastDate: DateTime.now(),
        );
        if (picked != null) {
          onSeleccion(picked);
        }
      },
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          suffixIcon: const Icon(Icons.calendar_today),
        ),
        child: Text(
          "${fecha.toLocal()}".split(' ')[0],
          style: const TextStyle(fontSize: 16),
        ),
      ),
    );
  }



  Widget _buildDrawerItem(String title, IconData icon, int index) {
    final bool isSelected = _selectedIndex == index;
    final bool hasSubmenu =
        title == "Usuario" || title == "Productos" || title == "Repisa";

   if (!hasSubmenu) {
    return ListTile(
        leading: Icon(icon, color: Colors.deepPurple),
        title: Text(title),
        selected: isSelected,
        onTap: () {
          setState(() {
            _selectedIndex = index;
            _selectedSubMenu = null;
          });
          Navigator.pop(context);
          if (title == "Productos") {
            Navigator.push(context,
              MaterialPageRoute(builder: (_) => const ProductListScreen()),
            );
          }
        },
      );
    }  

    return Theme(
      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        leading: Icon(icon, color: Colors.deepPurple),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        collapsedBackgroundColor: isSelected ? Colors.deepPurple.shade50 : null,
        backgroundColor: isSelected ? Colors.deepPurple.shade100 : null,
        initiallyExpanded: isSelected,
        children:
            _menuStructure[title]!
                .map(
                  (sub) => ListTile(
                    title: Padding(
                      padding: const EdgeInsets.only(left: 16.0),
                      child: Text(sub),
                    ),
                    selected: _selectedSubMenu == sub,
                    selectedTileColor: Colors.deepPurple.shade100,
                    onTap: () {
                      setState(() {
                        _selectedIndex = index;
                        _selectedSubMenu = sub;
                      });
                      Navigator.pop(context);

                      if (sub == "Marca") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const MarcaScreen(),
                          ),
                        );
                      } else if (sub == "Categoría") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const CategoriaScreen(),
                          ),
                        );
                      }
                    },
                  ),
                )
                .toList(),

        onExpansionChanged: (expanded) {
          if (expanded) {
            setState(() {
              _selectedIndex = index;
              _selectedSubMenu = null;
            });
          }
        },
      ),
    );
  }

  double _calcularIntervalo(List<int> cantidades) {
    final max = cantidades.isNotEmpty ? cantidades.reduce((a, b) => a > b ? a : b) : 10;
    if (max <= 10) return 1;
    if (max <= 50) return 5;
    if (max <= 100) return 10;
    if (max <= 200) return 20;
    return 50;
  }

  double _calcularMaxY(List<int> cantidades) {
    final max = cantidades.reduce((a, b) => a > b ? a : b);
    return (max / 10.0).ceil() * 10.0 + 10.0; // asegura espacio para tooltip
  }



  Widget _buildGraficoVentaPorProducto() {
    if (_ventas.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(16.0),
        child: Text("No hay datos para mostrar."),
      );
    }

    final Map<String, int> acumuladoPorProducto = {};
    for (var venta in _ventas) {
      acumuladoPorProducto.update(
        venta.descripcion,
        (valor) => valor + venta.cantidadTotal,
        ifAbsent: () => venta.cantidadTotal,
      );
    }

    final productos = acumuladoPorProducto.keys.toList();
    final cantidades = acumuladoPorProducto.values.toList();

    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 16),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: SizedBox(
              height: 360,
              width: productos.length * 100.0,
              child: BarChart(
                BarChartData(
                  maxY: _calcularMaxY(cantidades),
                  barGroups: List.generate(productos.length, (i) {
                    return BarChartGroupData(
                      x: i,
                      barRods: [
                        BarChartRodData(
                          toY: cantidades[i].toDouble(),
                          color: Colors.deepPurple,
                          width: 40,
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ],
                    );
                  }),
                  barTouchData: BarTouchData(
                    enabled: true,
                    touchTooltipData: BarTouchTooltipData(
                      tooltipBgColor: Colors.deepPurple.shade100,
                      tooltipRoundedRadius: 8,
                      fitInsideVertically: true,
                      fitInsideHorizontally: true,
                      getTooltipItem: (group, groupIndex, rod, rodIndex) {
                        final producto = productos[group.x.toInt()];
                        final cantidad = rod.toY.toInt();
                        return BarTooltipItem(
                          '$producto\n$cantidad unidades',
                          const TextStyle(
                            color: Colors.black87,
                            fontWeight: FontWeight.w500,
                            fontSize: 13,
                          ),
                        );
                      },
                    ),
                    touchCallback: (event, response) {
                      if (response != null && response.spot != null) {
                        debugPrint("TOCADO: ${response.spot!.touchedBarGroupIndex}");
                      }
                    },
                  ),
                  titlesData: FlTitlesData(
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 48,
                        getTitlesWidget: (value, _) {
                          final int i = value.toInt();
                          if (i >= productos.length) return const SizedBox();
                          return Padding(
                            padding: const EdgeInsets.only(top: 4.0),
                            child: Text(
                              productos[i].length > 12
                                  ? "${productos[i].substring(0, 12)}..."
                                  : productos[i],
                              style: const TextStyle(fontSize: 12),
                              textAlign: TextAlign.center,
                            ),
                          );
                        },
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        interval: _calcularIntervalo(cantidades),
                        reservedSize: 42,
                        getTitlesWidget: (value, meta) {
                          return Padding(
                            padding: const EdgeInsets.only(right: 4),
                            child: Text(
                              value % 1 == 0 ? value.toInt().toString() : '',
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.black87,
                                fontFeatures: [FontFeature.tabularFigures()],
                              ),
                              textAlign: TextAlign.right,
                            ),
                          );
                        },
                      ),
                    ),
                    topTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 3, 
                      ),
                    ),
                    rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  ),
                  gridData: FlGridData(show: true),
                  borderData: FlBorderData(show: true),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }






  Widget _buildMainContent() {
    if (_selectedIndex == 0) {
      return SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildFiltroFechas(),
            const SizedBox(height: 24),
            const Text(
              "Venta por producto",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            _cargando
                ? const Center(child: CircularProgressIndicator())
                : _buildGraficoVentaPorProducto(),
          ],
        ),
      );
    }
    if (_selectedIndex == 1) { // el índice de "Productos"
      return const ProductListScreen();
    }
    return const Center(
      child: Text("Seleccione una opción del menú"),
    );
  }



  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    Navigator.of(context).pushReplacementNamed('/login');
  }

  void _showProfileMenu() async {
    final selected = await showMenu<String>(
      context: context,
      position: const RelativeRect.fromLTRB(1000, 80, 16, 0),
      items: const [
        PopupMenuItem(value: 'logout', child: Text('Cerrar Sesión')),
      ],
    );

    if (selected == 'logout') {
      _logout();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Tienda Supermercado"),
        backgroundColor: const Color.fromARGB(255, 151, 110, 228),
        elevation: 4,
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle, size: 28),
            tooltip: 'Perfil',
            onPressed: _showProfileMenu,
          ),
        ],
      ),
      drawer: Drawer(
        elevation: 8,
        child: Container(
          color: Colors.white,
          child: ListView(
            padding: EdgeInsets.zero,
            children: [
              const DrawerHeader(
                decoration: BoxDecoration(
                  color: Colors.deepPurple,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black26,
                      offset: Offset(0, 4),
                      blurRadius: 8,
                    ),
                  ],
                ),
                child: Text(
                  "Menú de navegación",
                  style: TextStyle(color: Colors.white, fontSize: 24),
                ),
              ),
              ..._menuStructure.keys.toList().asMap().entries.map((entry) {
                int index = entry.key;
                String title = entry.value;
                IconData icon = Icons.menu;
                switch (title) {
                  case "Dashboard":
                    icon = Icons.dashboard;
                    break;
                  case "Usuario":
                    icon = Icons.person;
                    break;
                  case "Productos":
                    icon = Icons.shopping_cart;
                    break;
                }
                return _buildDrawerItem(title, icon, index);
              }),
            ],
          ),
        ),
      ),
      body: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: const BoxDecoration(
          color: Color(0xFFF4F4F4),
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              offset: Offset(0, 2),
              blurRadius: 6,
            ),
          ],
        ),
        child: _buildMainContent(),
      ),
    );
  }
}
