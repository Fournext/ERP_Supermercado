import 'package:flutter/material.dart';
import 'package:login/screens/LoginScreen.dart';
import 'package:login/screens/ProductListScreen.dart'; 
import 'package:login/screens/DashboardScreen.dart';
import 'package:login/screens/ProductScreen.dart'; // Import necesario

/// The main entry point for the application.
///
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'ERP_Supermercado',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => LoginScreen(),
        '/products': (context) => ProductListScreen(),
        '/dashboard': (context) => DashboardScreen(),
        '/productScreen': (context) => ProductScreen(), // Ruta añadida
      },
    );
  }
}
