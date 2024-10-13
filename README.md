
Ecommerce API

Esta API proporciona una interfaz robusta para gestionar productos y usuarios en una aplicación de comercio electrónico. Ofrece endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en productos, así como funcionalidades para autenticación y autorización de usuarios.

Gestión de Productos: Permite crear, leer, actualizar y eliminar productos, incluyendo información detallada como nombre, descripción, precio, imágenes, etc.
Autenticación de Usuarios: Permite a los usuarios registrarse, iniciar sesión y cerrar sesión utilizando tokens JWT para una autenticación segura.
Autorización: Implementa roles de usuario y permisos para controlar el acceso a diferentes recursos y endpoints de la API.
Documentación Swagger: Incluye documentación completa de la API utilizando Swagger/OpenAPI, lo que facilita la exploración y la integración por parte de los desarrolladores.
Clonar el repositorio:
git clone <URL_DEL_REPOSITORIO>



Instalar dependencias:
npm install



Configurar variables de entorno:

DATABASE_URL: URL de la base de datos
PORT: Puerto en el que se ejecutará la API (por defecto, 3000)
JWT_SECRET: Clave secreta para la firma de tokens JWT
Iniciar la API:

npm start



Método	Endpoint	Descripción
GET	/products	Obtiene todos los productos.
GET	/products/:id	Obtiene un producto por su ID.
POST	/products	Crea un nuevo producto.
PUT	/products/:id	Actualiza un producto existente.
DELETE	/products/:id	Elimina un producto.
POST	/users/register	Registra un nuevo usuario.
POST	/users/login	Inicia sesión de un usuario.
POST	/users/logout	Cierra sesión de un usuario.
Se utiliza la autenticación basada en tokens JWT (JSON Web Token).
Para acceder a endpoints protegidos, se debe incluir el token JWT en el encabezado Authorization con el formato Bearer <token>.
La documentación completa de la API, generada con Swagger/OpenAPI, está disponible en: [URL_DE_LA_DOCUMENTACIÓN_SWAGGER] (reemplaza con la URL real)
Las contribuciones son bienvenidas! Si deseas contribuir al proyecto, por favor, crea un fork del repositorio, realiza tus cambios y envía un pull request.
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para obtener más información.
Si tienes alguna pregunta o necesitas ayuda, por favor, contacta con [TU_CORREO_ELECTRÓNICO]
