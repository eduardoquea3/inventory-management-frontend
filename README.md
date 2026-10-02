# Frontend de inventario

Aplicación de inventario con Vue 3 y una interfaz responsive para productos, categorías y movimientos de stock.

## Stack

- Vue 3 y Vue Router 4
- Pinia y Axios
- Tailwind CSS 4
- Vite 8
- Bun 1.4.2 para dependencias, desarrollo y pruebas

## Desarrollo local

Requisitos: Bun 1.4.2 o compatible con `bun.lock`.

```bash
bun install
bun run dev
```

La URL de API predeterminada es `http://127.0.0.1:8000/api`. Puedes cambiarla definiendo `VITE_API_URL` en un archivo de entorno local antes de iniciar Vite.

Comandos disponibles:

```bash
bun run test
bun run build
bun run preview
```

## Desarrollo con Docker y Nginx

Backend y frontend son repositorios independientes que se clonan como carpetas hermanas:

```bash
git clone <BACKEND_REPOSITORY_URL> backend-legacy-laravel8
git clone <FRONTEND_REPOSITORY_URL> frontend-legacy-vue2
```

El Compose coordinado vive en el repositorio backend e incluye los tres servicios (`mysql`, `app` y `frontend`). Desde `../backend-legacy-laravel8` ejecuta:

```bash
# Docker Engine
docker compose up --build

# Podman rootless en Linux
BACKEND_DNS_RESOLVER=10.89.1.1 podman-compose up --build
```

Abre <http://localhost:8081>. El Compose backend construye el Dockerfile de este repositorio y Nginx sirve la aplicación y reenvía `/api` a Laravel.

También puedes ejecutar frontend y backend como Compose independientes. Elige el bloque correspondiente a tu runtime:

```bash
# Docker Engine
cd ../backend-legacy-laravel8
docker compose up --build -d mysql app
cd ../frontend-legacy-vue2
BACKEND_DNS_RESOLVER=127.0.0.11 docker compose up --build
```

```bash
# Podman rootless en Linux
cd ../backend-legacy-laravel8
BACKEND_DNS_RESOLVER=10.89.1.1 podman-compose up --build -d mysql app
cd ../frontend-legacy-vue2
BACKEND_DNS_RESOLVER=10.89.1.1 podman-compose up --build
```

El modo independiente publica la UI en `http://localhost:8080`. Para detenerlo, ejecuta `docker compose down` o `podman-compose down` desde este repositorio.

Nginx sirve los assets de Vite, entrega `index.html` para rutas de Vue Router y reenvía `/api/*` al servicio `app:8000` por la red Docker. La imagen se compila con `VITE_API_URL=/api`, así el navegador usa el mismo origen para la UI y la API. El proxy vuelve a resolver `app` cada 10 segundos para tolerar la recreación del contenedor backend.

El Compose frontend independiente espera la red externa `backend-legacy-laravel8_default`, creada al iniciar el Compose desde el directorio del backend. Si usas otro nombre de proyecto Compose, establece `BACKEND_DOCKER_NETWORK` y `BACKEND_DNS_RESOLVER` con el nombre de red y su dirección DNS (`127.0.0.11` en Docker Engine, `10.89.1.1` en Podman rootless). Puedes cambiar el puerto publicado del frontend con `FRONTEND_PORT` (predeterminado `8080` para el Compose independiente; `8081` en el Compose coordinado).

Para detener la UI, ejecuta `docker compose down` desde este repositorio. Detén el backend por separado desde su repositorio.

## API y autenticación

En desarrollo local, Axios usa la URL definida en `VITE_API_URL` (o `http://127.0.0.1:8000/api` si no se define). En Docker, Nginx reenvía `/api/` a `app:8000/api/` dentro de la red backend. El cliente agrega `Authorization: Bearer <token>` desde el token de sesión guardado en el navegador.
