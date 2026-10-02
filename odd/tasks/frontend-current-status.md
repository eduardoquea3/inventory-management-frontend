# Estado actual del frontend

Resumen vigente de trabajo terminado y tareas abiertas. La cronología detallada está en [vue3-frontend-migration.md](./vue3-frontend-migration.md).

## Hecho

- [x] Migración base a Vue 3, Vue Router 4, Pinia y cliente HTTP centralizado con protección de rutas.
- [x] Rutas de login, dashboard, productos, alta/edición de producto, movimientos de stock y categorías.
- [x] Rediseño responsive con Tailwind 4 y theme warehouse en el shell y las seis vistas.
- [x] Flujos de interfaz para productos y categorías: CRUD, filtros, paginación y estados de carga/error/vacío.
- [x] Filtros y ordenamiento según contrato actual: productos por texto/categoría/estado/precio/stock y categorías por texto/estado; columnas y direcciones permitidas.
- [x] Lectura del envelope `data` + `meta.pagination` en listas y selectores de categorías; límite de `per_page` hasta 100.
- [x] Pruebas de vistas para consultas de catálogo, límites de filtros, CRUD de categorías, alta de productos con categorías paginadas y registro/recarga del historial de stock.
- [x] Flujo de movimientos de stock con validación de cantidad positiva y feedback.
- [x] Dockerfile multi-stage, Nginx SPA/API proxy y Compose frontend conectado a la red externa del backend.
- [x] README actualizado con desarrollo Bun, pruebas, build y arranque Docker coordinado con el backend.
- [x] Toolchain actualizado a Vite 8.3.2, `@vitejs/plugin-vue` 6.0.9 y Vitest 5.0.3.
- [x] Verificación frontend: `bun run test` (31 tests) y `bun run build` pasan.
- [x] Verificación backend aislada: `podman exec` con `APP_ENV=testing`, SQLite `:memory:` y `vendor/bin/phpunit --configuration phpunit.xml.dist` pasa (31 tests, 237 assertions).
- [x] Verificación Docker/Nginx: imagen construida; los Compose integrado y separado sirven SPA/ruta profunda/assets en `http://localhost:8081` y `http://localhost:8080`; ambos proxyean `/api/health` con 200. `/api/products` sin token devuelve 401. Nginx está configurado para refrescar DNS de `app`.

## Pendiente

- [ ] **Verificar contratos contra el backend**: autenticación, respuestas y errores de productos/categorías, dashboard y movimientos; la compilación no confirma compatibilidad en ejecución.
- [ ] **Verificar filtros, ordenamiento y paginación contra el backend**: probar los límites de precio/stock, el 422 `VALIDATION_FAILED`, cambios de página/tamaño y eliminación del último elemento de una página.
- [ ] **Hacer revisión visual en navegador** de las seis rutas en desktop y mobile, incluida la navegación por teclado. Orca `computer list-apps` reportó `unsupported_capability` (requisito python3-gi/AT-SPI); no se capturaron pantallas.
- [ ] **Probar flujos autenticados de extremo a extremo en navegador** contra el backend. No se envió login ni se modificó el token/catálogo compartido; el smoke test live fue sólo GET health y GET protegido sin token.
- [ ] **Probar filtros, ordenamiento, rangos, paginación y formularios desde la UI contra el backend**. Los tests backend pasan, pero aún falta un recorrido autenticado desde el navegador.
- [ ] **Decidir la recuperación de la base de desarrollo**: una ejecución previa de `php artisan test` con `APP_ENV=local`/MySQL y `RefreshDatabase` reinicializó las tablas. En la última consulta sólo aparecían filas del dataset `Volume Product` (10.000 productos, 100 categorías y 30.000 movimientos); los nombres `Producto Legacy` no aparecían. MySQL tiene binlogs habilitados, pero no se ha hecho replay ni reseed. No restaurar datos sin autorización.

## Criterio de cierre

Dar por cerradas las tareas de integración cuando se complete la sesión visual/autenticada con el backend activo. Mantener identificadas por separado las limitaciones de pruebas automatizadas y de verificación visual.
