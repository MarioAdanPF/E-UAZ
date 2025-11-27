# EcoUAZ - Plataforma de Contribuciones Ambientales 🌱

Una aplicación web completa para incentivar el cuidado del medio ambiente entre los estudiantes universitarios. Los usuarios pueden compartir sus acciones ecológicas, ver contribuciones de otros y competir en un ranking por su compromiso ambiental.

## 🎯 Características

- **Autenticación JWT**: Sistema seguro de registro e inicio de sesión
- **Contribuciones**: Publicar acciones ambientales con imágenes y descripciones
- **Ranking**: Sistema de puntos basado en número de contribuciones
- **Perfil de Usuario**: Gestión de información personal
- **Feed Social**: Explorar contribuciones de toda la comunidad
- **Responsive**: Diseño adaptable para móvil, tablet y desktop

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js + Express
- PostgreSQL (Supabase)
- Sequelize ORM
- JWT para autenticación
- Bcrypt para hash de contraseñas

### Frontend
- React 18
- React Router v6
- TanStack Query (React Query)
- Axios
- TailwindCSS
- Lucide React (iconos)

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (o cuenta de Supabase)
- npm o yarn

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd E-UAZ
```

### 2. Configurar Backend

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Edita el archivo .env con tus credenciales:
PORT=3000
DATABASE_URL=tu_url_de_postgresql
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=7d

# Ejecutar migraciones
npx sequelize-cli db:migrate

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará corriendo en `http://localhost:3000`

### 3. Configurar Frontend

```bash
cd client

# Instalar dependencias
npm install

# Crear archivo .env
echo "REACT_APP_API_URL=http://localhost:3000/api" > .env

# Iniciar aplicación
npm start
```

El frontend estará corriendo en `http://localhost:3000` (o el puerto siguiente disponible)

## 📁 Estructura del Proyecto

```
E-UAZ/
├── config/                 # Configuración de la base de datos
├── controllers/            # Lógica de negocio
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── contribution.controller.js
├── middlewares/           # Middlewares personalizados
│   └── auth.middleware.js
├── migrations/            # Migraciones de la base de datos
├── models/                # Modelos de Sequelize
│   ├── user.js
│   └── contribution.js
├── routes/                # Rutas de la API
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── contribution.routes.js
├── utils/                 # Utilidades
│   ├── jwt.js
│   └── password.js
├── client/                # Aplicación React
│   ├── public/
│   └── src/
│       ├── components/    # Componentes reutilizables
│       ├── config/        # Configuración de API
│       ├── contexts/      # Context API
│       ├── pages/         # Páginas de la aplicación
│       └── App.jsx
├── .env                   # Variables de entorno
├── index.js              # Punto de entrada del servidor
└── package.json
```

## 🔐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere auth)
- `PUT /api/auth/profile` - Actualizar perfil (requiere auth)

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/ranking` - Obtener ranking de usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `GET /api/users/:id/stats` - Obtener estadísticas de usuario

### Contribuciones
- `GET /api/contributions` - Obtener todas las contribuciones
- `GET /api/contributions/search` - Buscar contribuciones
- `GET /api/contributions/my` - Mis contribuciones (requiere auth)
- `POST /api/contributions` - Crear contribución (requiere auth)
- `GET /api/contributions/:id` - Obtener contribución por ID
- `PUT /api/contributions/:id` - Actualizar contribución (requiere auth)
- `DELETE /api/contributions/:id` - Eliminar contribución (requiere auth)

## 🎨 Características de Diseño

- **UI Moderna**: Interfaz limpia y profesional con TailwindCSS
- **Tema Verde**: Paleta de colores enfocada en la naturaleza
- **Iconos**: Lucide React para iconografía consistente
- **Animaciones**: Transiciones suaves y feedback visual
- **Responsive**: Adaptado para todos los tamaños de pantalla

## 📝 Modelo de Datos

### Usuario
- username (único)
- name
- password_hash
- createdAt, updatedAt, deletedAt

### Contribución
- description
- images (array de URLs)
- user_id (referencia a Usuario)
- createdAt, updatedAt, deletedAt

## 🔄 Flujo de la Aplicación

1. **Registro/Login**: Usuario crea cuenta o inicia sesión
2. **Home**: Dashboard con información y accesos rápidos
3. **Contribuciones**: Ver feed de todas las contribuciones
4. **Crear**: Publicar nueva contribución con imágenes
5. **Ranking**: Ver top usuarios por contribuciones
6. **Perfil**: Gestionar información personal

## 🌟 Características Futuras (Posibles Mejoras)

- Upload directo de imágenes (Cloudinary/AWS S3)
- Likes y comentarios en contribuciones
- Categorías de acciones ambientales
- Notificaciones en tiempo real
- Sistema de insignias/badges
- Exportar estadísticas
- Modo oscuro

## 🤝 Contribuir

Este es un proyecto escolar, pero las sugerencias son bienvenidas.

## 📄 Licencia

Este proyecto es de código abierto para propósitos educativos.

## 👨‍💻 Autor

Desarrollado como proyecto escolar para la UAZ

---

**EcoUAZ** - Juntos por un mejor medio ambiente 🌍💚
