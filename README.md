# InterHub — Backend (interhub-backend)

Última actualización: 2025-10-16

Backend del proyecto InterHub (alias Pasantiando). Esta aplicación está construida con NestJS y Prisma y provee la API REST principal que consume el frontend (`interhub-frontend`). El backend implementa autenticación, autorización, gestión de usuarios (estudiantes, empresas y administradores), publicación de pasantías, postulación a vacantes, notificaciones y otros servicios relacionados.

Resumen técnico
- Framework: NestJS (TypeScript)
- ORM: Prisma (PostgreSQL en producción recomendado)
- Autenticación: JWT (access + refresh tokens) y/o estrategias OAuth (configurable)
- Testing: Jest (unit + e2e)
- Linting/Formato: ESLint y Prettier

Contenido de este README
- Requisitos
- Estructura del proyecto
- Instalación y configuración local
- Variables de entorno (recomendadas)
- Prisma: generación, migraciones y cliente
- Scripts útiles (npm)
- Testing
- Desarrollo y despliegue (producción)
- Seguridad y buenas prácticas
- Resolución de problemas comunes
- Contacto y referencias


Requisitos
- Node.js 18+ (recomendado)
- npm o pnpm
- PostgreSQL (local o contenedor) para desarrollo avanzado; Prisma puede usarse con SQLite para pruebas rápidas.


Estructura principal del proyecto
```
interhub-backend/
├─ prisma/                # Esquema Prisma y migraciones
├─ src/
│  ├─ modules/            # Módulos por dominio (auth, users, interships, applications, etc.)
│  ├─ common/             # Guards, pipes, decorators, enums
│  ├─ prisma/             # PrismaModule y PrismaService
│  ├─ utils/              # Utilidades y helpers
│  └─ main.ts             # Bootstrap de la aplicación
├─ generated/             # (opcional) cliente Prisma generado
├─ test/                  # tests e2e
├─ package.json
└─ tsconfig.json
```


Instalación y configuración local
1. Clona el repositorio y ve al directorio del backend:

```powershell
cd c:\Users\jeans\Documents\WorkSpace\InterHub\interhub-backend
```

2. Instala dependencias:

```powershell
npm install
```

3. Configura variables de entorno
Copia `.env.example` a `.env` (si existe) y completa las variables necesarias (ver sección abajo).

4. Ejecuta la base de datos de desarrollo
- Recomiendo PostgreSQL en Docker para una configuración lo más parecida a producción:

```powershell
docker run --name interhub-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=interhub -p 5432:5432 -d postgres:15
```

5. Genera Prisma client y aplica migraciones:

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

6. Levanta la aplicación en modo desarrollo:

```powershell
npm run start:dev
```


Variables de entorno recomendadas
Rellena las variables en `.env` según tu entorno. Ejemplo mínimo:

```
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/interhub?schema=public
JWT_SECRET=change_this_secret
JWT_REFRESH_SECRET=change_this_refresh_secret
NODE_ENV=development
EMAIL_PROVIDER_API_KEY=
SENTRY_DSN=
```

Explicación rápida:
- `DATABASE_URL`: cadena de conexión para Prisma/PostgreSQL.
- `JWT_SECRET` / `JWT_REFRESH_SECRET`: secretos para firmar tokens JWT.
- `SENTRY_DSN`: DSN de Sentry para monitoreo de errores (opcional).


Prisma — generación, migraciones y cliente
- Para generar el cliente Prisma después de modificar `prisma/schema.prisma`:

```powershell
npx prisma generate
```

- Para crear y aplicar migraciones en desarrollo:

```powershell
npx prisma migrate dev --name descriptive_migration_name
```

- Para desplegar migraciones en entornos CI/CD o producción:

```powershell
npx prisma migrate deploy
```

- Notas:
  - El directorio `generated/prisma` en este repo contiene artefactos generados; decide si lo versionas o lo ignoras (recomendado ignorarlo y generar en CI).
  - Si necesitas resetear datos durante desarrollo: `npx prisma migrate reset` (eliminará y recreará la BD local; usar con precaución).


Scripts npm importantes
- `npm run start` — arranca en modo producción (requiere build previo si aplica)
- `npm run start:dev` — arranca en modo desarrollo (con hot-reload / watch)
- `npm run start:prod` — arranca con configuraciones de producción
- `npm run build` — compilar TypeScript (si está configurado)
- `npm run test` — tests unitarios
- `npm run test:e2e` — pruebas end-to-end
- `npm run test:cov` — cobertura de tests
- `npm run lint` — ejecuta ESLint
- `npm run format` — ejecuta Prettier


Testing y calidad
- Unit tests: Jest, ubicados en `src/**/*.spec.ts`.
- E2E tests: carpeta `test/` con configuración `jest-e2e.json`.
- Ejecuta `npm run test` para tests unitarios y `npm run test:e2e` para los e2e.
- Integra linters y hooks pre-commit (Husky) en CI para asegurar calidad.


Despliegue y producción
- Recomendaciones generales:
  - Usa PostgreSQL administrado (RDS, Cloud SQL) o contenedores con volúmenes persistentes.
  - Ejecuta `npx prisma migrate deploy` durante el pipeline de despliegue.
  - Genera Prisma client en el pipeline (`npx prisma generate`).
  - Configura variables de entorno en tu proveedor (Heroku, AWS ECS, DigitalOcean, Render, etc.).
  - Monitorea con Sentry / Prometheus y configura alertas.

- Contenedores:
  - Dockerfile recomendado para producción: construir la app en una etapa y ejecutar el binario JS/TS transpilado.
  - Usa multi-stage build para reducir tamaño de imagen.

Ejemplo de pasos en CI:
1. Instalar dependencias
2. Ejecutar linter y tests
3. Ejecutar `npx prisma migrate deploy`
4. Generar Prisma client `npx prisma generate`
5. Construir y desplegar la imagen/artefacto


Seguridad y buenas prácticas
- Secrets: NO guardes secretos en el repo; usa secrets manager del proveedor o variables de entorno en CI.
- Tokens JWT: almacena accesos en cookies HttpOnly si usas navegador; lleva refresh tokens con control de revocación.
- Rate limiting: añade rate-limiting para endpoints sensibles (auth, password reset) usando `@nestjs/throttler`.
- Validación: usa `class-validator` y `class-transformer` en DTOs para validar y sanitizar entradas.
- CORS: configura CORS con origenes permitidos (frontend URL) y evita `*` en producción.
- CSRF: si usas cookies para auth, considera protección CSRF.


Resolución de problemas comunes
- Error: `Prisma client is not found` — ejecuta `npx prisma generate`.
- Error de migraciones: revisa `prisma/migrations` y usa `npx prisma migrate resolve` si necesitas marcar migraciones aplicadas.
- Problemas con la DB en Docker: comprueba `docker logs interhub-postgres` y que el puerto 5432 esté expuesto.


Recursos y referencias
- Prisma: https://www.prisma.io/docs
- NestJS: https://docs.nestjs.com
- Ejemplos de despliegue: DigitalOcean, Render, AWS ECS/EKS


Contacto
- Equipo InterHub: `dev@interhub.example` (reemplazar por email real)

---

Este README está pensado para ser un documento operativo: si quieres que añada secciones específicas (endpoints principales, diagramas ER de la base de datos, ejemplos de requests para las APIs o scripts de Dockerfile/CI) dime cuáles y los incluyo en la próxima actualización.
