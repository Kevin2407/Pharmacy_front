# Sistema de Gestión de Farmacia

Una aplicación web moderna para la gestión de inventario de farmacias construida con React, TypeScript y componentes de interfaz PrimeReact.

![Sistema de Gestión de Farmacia](https://on-demand-app.com/asset-ondemand/images/pharmacy_delivery_solution/hero_img.webp)

## Características

- Gestión de productos (agregar, editar, eliminar, listar)
- Gestión de categorías (agregar, editar, eliminar, listar)
- Seguimiento de inventario
- Diferentes tipos de productos (general, medicamento, medicamento con receta)
- Interfaz de usuario responsiva
- Funcionalidad de exportación de datos

## Tecnologías Utilizadas

- **Frontend**: React 19, TypeScript, Vite
- **Componentes UI**: PrimeReact, PrimeFlex, PrimeIcons
- **Enrutamiento**: React Router
- **Cliente HTTP**: Axios
- **Integración API**: RESTful API

## Comenzando

### Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn

### Instalación

1. Clonar el repositorio
   ```
   git clone https://github.com/tunombredeusuario/Pharmacy_front.git
   cd Pharmacy_front
   ```

2. Instalar dependencias
   ```
   npm install
   ```

3. Configurar variables de entorno
   Crear un archivo `.env` en el directorio raíz con el siguiente contenido:
   ```
   VITE_API_URL=http://localhost:8080
   ```

4. Iniciar el servidor de desarrollo
   ```
   npm run dev
   ```

5. Abrir el navegador y navegar a http://localhost:5173

## Estructura del Proyecto

```
Pharmacy_front/
├── public/
├── src/
│   ├── components/      # Componentes React
│   ├── layout/          # Componentes de diseño
│   ├── services/        # Clases de servicios API
│   ├── App.tsx          # Componente principal de la aplicación
│   └── main.tsx         # Punto de entrada de la aplicación
├── .env                 # Variables de entorno
├── index.html           # Plantilla HTML
├── tsconfig.json        # Configuración de TypeScript
└── vite.config.ts       # Configuración de Vite
```

## Scripts

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run lint` - Ejecutar linting
- `npm run preview` - Vista previa de la compilación de producción

## Integración de API

La aplicación se conecta a una API backend para la persistencia de datos. Asegúrese de que el servidor backend esté ejecutándose en la URL especificada en su archivo `.env`.

## Mejoras Futuras

- Autenticación y autorización de usuarios
- Seguimiento de ventas y transacciones
- Informes y análisis
- Integración de escáner de códigos de barras
- Aplicación móvil

## Contribuciones

1. Hacer un fork del repositorio
2. Crear una rama para tu función (`git checkout -b funcion/caracteristica-asombrosa`)
3. Confirmar tus cambios (`git commit -m 'Agregar alguna característica asombrosa'`)
4. Enviar a la rama (`git push origin funcion/caracteristica-asombrosa`)
5. Abrir una Solicitud de Extracción

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
