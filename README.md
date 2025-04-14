## Configuraciones Basicas
* Descargar IDEA Comuniry.
* Instalar node.js(V.21 o superior).
* Instalar Angular 19 (npm install -g @angular/cli).
* Instalar Tailwind CSS (npm install tailwindcss @tailwindcss/postcss postcss --force) en el proyecto de ser necesario.

## Estuctura de Back
* Entidad: Se crean los modelos de los body en que se va a recibir y enviar los datos.
* Repository: Guarda las peticiones basicas a la base de datos (Solo se importa una libreria y no se suele modificar).
* Servicios: Usa las entidades junto con las peticiones basicas del repositorio para crear el CRUD.
* Controlador: Llama a los servicios y los mapea con direcciones para ser consumidos (Ej: /getUser).

## Estructura del Front
* app: Se crean los componente(ng g c [nombre-del-componente] ).
* img: Se guardan las imagenes necesarias para el proyecto (Sujeto a cambios).
* interface: Al igual que las entidades en el Back se crea un modelo de como se debe enviar y recibir la informacion.
* servicios: Se consume la API del back y se crear los servicios independientes para cada componente
* appRoutes: Aqui se deben configurar las rutas as los distintos componentes

## NOTA
Tome en cuenta que los atributos que asigne en alguna entidad, debes ser iguales a los atributos asignados en alguna interfaz con el mismo nombre, al igual que los datos sacados de la base de datos,
ya que estos atributos actuan como una llave Hash y que al momento de variar el nombre no se podra recuperar la informacion deseada o aparecera como "none" ese atributo en el body.

Cualquier duda consultar al Scrum Master a cargo ;)
