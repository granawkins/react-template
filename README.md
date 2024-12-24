# Plantilla de Aplicación Fullstack

Esta es una plantilla para aplicaciones web fullstack que utiliza React para el frontend y Express para el backend.

## Estructura del Proyecto

El proyecto está organizado en dos directorios principales:

- `/client`: Aplicación frontend en React + TypeScript
- `/server`: Servidor backend en Express + TypeScript

## Tecnologías Principales

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- Testing Library

### Backend
- Express
- TypeScript
- SQLite (better-sqlite3)
- Vitest para pruebas

## Instalación

1. Clona el repositorio:
```bash
git clone [url-del-repositorio]
cd [nombre-del-repositorio]
```

2. Instala las dependencias:
```bash
npm install
```

## Scripts Disponibles

### Scripts Globales

- `npm run dev`: Inicia tanto el cliente como el servidor en modo desarrollo
- `npm run build`: Compila tanto el cliente como el servidor
- `npm run test`: Ejecuta las pruebas en todos los workspaces
- `npm run lint`: Ejecuta el linter en todos los archivos
- `npm run lint:fix`: Corrige automáticamente los problemas de linting
- `npm run format`: Formatea el código usando Prettier

### Scripts del Cliente (en el directorio `/client`)

- `npm run dev`: Inicia el servidor de desarrollo de Vite
- `npm run build`: Compila la aplicación para producción
- `npm run preview`: Vista previa de la compilación de producción

### Scripts del Servidor (en el directorio `/server`)

- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática
- `npm run build`: Compila el servidor
- `npm run start`: Inicia el servidor en modo producción

## Desarrollo

1. Inicia el modo desarrollo:
```bash
npm run dev
```

2. Abre [http://localhost:5173](http://localhost:5173) para ver el cliente
3. El servidor estará ejecutándose en [http://localhost:3000](http://localhost:3000)

## Pruebas

El proyecto incluye pruebas unitarias tanto para el frontend como para el backend. Para ejecutar las pruebas:

```bash
npm run test
```

## Formateo y Linting

El proyecto utiliza ESLint y Prettier para mantener un estilo de código consistente. Puedes ejecutar:

```bash
npm run lint     # para verificar problemas
npm run lint:fix # para corregir problemas automáticamente
npm run format   # para formatear el código
```