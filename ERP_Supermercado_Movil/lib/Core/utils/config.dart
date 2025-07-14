
class Config {
  static const bool isProduction = true;

  static String get baseUrl {
    if (isProduction) {
      // 🔗 URL del backend desplegado en la nube (EC2 o dominio)
      return 'http://ec2-18-117-180-26.us-east-2.compute.amazonaws.com:3005/api';
    }

    //  OPCIONES DE DESARROLLO:
    // Solo descomenta UNA de las siguientes líneas según el entorno:

    // Flutter Web (Chrome) desde la misma PC del backend
    return 'http://localhost:3005/api';

    // Android Emulator (usa 10.0.2.2 para acceder a localhost del host)
    // return 'http://10.0.2.2:3005/api';

    // Dispositivo físico Android conectado por USB (accede a tu PC por IP local)
    // return 'http://192.168.0.6:3005/api'; //  Reemplaza con tu IP local real

    // Otra opción para dispositivos en red local (ej. backend en otra PC)
    // return 'http://192.168.1.100:3005/api'; //  Ajusta a tu red local

   }
}
