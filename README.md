# VigixAI Chatbot API

La API de VigixAI es un backend desarrollado con NestJS para gestionar autenticación, usuarios, generación de contenido con IA, almacenamiento documental, gestión de normas y recorridos de conversación dentro del ecosistema de ECCL. El proyecto combina MongoDB, JWT, validación de DTOs, tratamiento de archivos y conectividad con distintos proveedores de modelos de lenguaje.

## 1. Descripción general

La aplicación se inicia con NestJS y se registra en el módulo principal `AppModule`, donde se importan todos los módulos del sistema y se agrega un interceptor global para registrar peticiones y respuestas. La API también integra un guard global de autenticación JWT y un pipe global de validación, lo que hace que la mayoría de los endpoints queden protegidos por defecto.

El backend ofrece una estructura modular y extensible para:

- gestionar usuarios y autenticación
- consultar o crear prompts reutilizables
- guardar respuestas generadas por IA
- gestionar normas, evaluaciones y items
- cargar documentos de texto y Word
- consultar modelos locales con Ollama
- invocar modelos generativos de Google Gemini
- enviar correos de soporte
- monitorear salud del sistema

## 2. Tecnologías principales

- NestJS 12
- TypeScript
- MongoDB + Mongoose
- Redis para manejo de refresh tokens revocados
- Passport + JWT
- Multer para archivos
- Swagger para documentación de endpoints
- Google Generative AI
- Ollama para modelos locales
- Nodemailer para correos
- Class-validator y Class-transformer

## 3. Arquitectura aplicada

La aplicación está organizada por módulos, cada uno con su controlador, servicio y DTOs. La inicialización principal se observa en `src/app.module.ts`.

Los módulos activos en la aplicación son:

- `database`
- `auth`
- `users`
- `prompts`
- `answers`
- `norms`
- `items`
- `reviews`
- `documents`
- `local`
- `chatgemini`
- `chatxai`
- `sendmail`
- `metrics` (esquema de sesión)

Además, la app incorpora:

- un interceptor global de logging: `src/loggin.interceptor.ts`
- un guard JWT global: `src/auth/jwtauth.guard.ts`
- una validación global con `ValidationPipe` en `src/main.ts`
- documentación Swagger en `/docs`

## 4. Módulos del sistema y su funcionalidad

### 4.1 Módulo principal y salud del sistema

Ubicación: `src/app.module.ts`, `src/app.controller.ts`, `src/app.service.ts`

Responsabilidades:

- bootstrap del backend
- registro de todos los módulos funcionales
- endpoints de estado del sistema
- métricas de memoria, CPU y uptime

Endpoints principales:

- `GET /` → devuelve el nombre de la API
- `GET /health` → estado del sistema y uso de memoria
- `GET /usage` → estadísticas del proceso
- `GET /status` → ping básico de disponibilidad

Esto sirve para comprobar que la API está viva y para observar su consumo de recursos.

### 4.2 Módulo de base de datos

Ubicación: `src/database/database.module.ts` y `src/database/database.providers.ts`

Responsabilidades:

- conecta la API con MongoDB usando la URI configurada en `.env`
- expone la conexión a la base de datos para el resto de módulos

Este módulo es la base sobre la que se apoyan los CRUDs de usuarios, prompts, normas, items, respuestas y reseñas.

### 4.3 Módulo de autenticación

Ubicación: `src/auth/*`

Responsabilidades:

- login con correo y contraseña
- validación de credenciales
- emisión y renovación de tokens JWT
- cierre de sesión
- consulta del usuario autenticado
- bloqueo de tokens y manejo de refresh token rotativo

Endpoints:

- `POST /auth/login` → autentica un usuario y devuelve accessToken + refreshToken
- `POST /auth/refresh` → renueva la sesión con un refresh token válido
- `POST /auth/logout` → invalida el token actual y cierra la sesión
- `GET /auth/me` → devuelve información del usuario autenticado

Flujo real del sistema:

1. El usuario envía email y contraseña.
2. El servicio valida la contraseña con bcrypt.
3. Se genera un access token de corta duración y un refresh token de mayor duración.
4. El refresh token se guarda de forma segura y se revoca si se reutiliza.
5. Se protege el resto de la API con `JwtAuthGuard` salvo rutas marcadas como públicas.

### 4.4 Módulo de usuarios

Ubicación: `src/users/*`

Responsabilidades:

- creación de usuarios
- listado de usuarios
- búsqueda por email o por usuario asignado
- actualización general del registro
- eliminación lógica o directa del registro

Endpoints:

- `POST /users`
- `GET /users`
- `GET /users?correo_electronico=...`
- `GET /users?usuario_asignado=...`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`

Uso:

Este módulo se usa para mantener la identidad del usuario que interactúa con la API y que luego queda vinculada a las sesiones autenticadas.

### 4.5 Módulo de prompts

Ubicación: `src/prompts/*`

Responsabilidades:

- CRUD de prompts reutilizables
- almacenamiento del texto base que se envía a modelos LLM
- gestión de plantillas para generación de contenido

Endpoints:

- `POST /prompts`
- `GET /prompts`
- `GET /prompts/:id`
- `PATCH /prompts/:id`
- `DELETE /prompts/:id`

Uso:

Se usa cuando el sistema necesita mantener instrucciones estándar, prompts reutilizables o entradas predefinidas para distintas tareas de IA.

### 4.6 Módulo de respuestas

Ubicación: `src/answers/*`

Responsabilidades:

- CRUD de respuestas generadas por IA
- guarda los resultados de conversaciones o ejecuciones de modelos

Endpoints:

- `POST /answers`
- `GET /answers`
- `GET /answers/:id`
- `PATCH /answers/:id`
- `PUT /answers/:id`
- `DELETE /answers/:id`

Uso:

Este módulo permite conservar historial de respuestas, reutilizar contenido generado o consultar ejecuciones previas para auditoría o integración con otros procesos.

### 4.7 Módulo de normas

Ubicación: `src/norms/*`

Responsabilidades:

- administración de normas o documentos regulatorios
- búsqueda por ID o por código interno
- creación, actualización y eliminación de registros normativos

Endpoints:

- `GET /norms`
- `GET /norms/:id`
- `GET /norms/codigo/:codigoNorma`
- `POST /norms`
- `PATCH /norms/:id`
- `PATCH /norms/codigo/:codigoNorma`
- `DELETE /norms/:id`
- `DELETE /norms/codigo/:codigoNorma`

Uso:

Se utiliza para mantener el marco normativo de la aplicación o de la organización, permitiendo comparar respuestas o decisiones con una referencia normativa.

### 4.8 Módulo de items

Ubicación: `src/items/*`

Responsabilidades:

- CRUD de items o registros de negocio
- permite crear entidades de negocio con estructura definida a través de DTOs
- actualización total o parcial por ID

Endpoints:

- `POST /items`
- `GET /items`
- `GET /items/:id`
- `PUT /items/:id`
- `PATCH /items/:id`
- `DELETE /items/:id`

Uso:

Se usa como capa de persistencia para recursos dinámicos de la aplicación, especialmente para generar o administrar elementos relacionados con ECCL.

### 4.9 Módulo de revisiones

Ubicación: `src/reviews/*`

Responsabilidades:

- almacenamiento de revisiones o evaluaciones de contenido
- CRUD de registros de revisión

Endpoints:

- `GET /reviews`
- `GET /reviews/:id`
- `POST /reviews`
- `PUT /reviews/:id`
- `DELETE /reviews/:id`

Uso:

Permite llevar un control de observaciones, validaciones o aprobaciones sobre contenido generado o procesos internos.

### 4.10 Módulo de documentos

Ubicación: `src/documents/*`

Responsabilidades:

- carga de archivos en el servidor
- soporte para archivos `.txt`, `.doc` y `.docx`
- listado y descarga de archivos almacenados
- uso del interceptor `FileInterceptor` y `FilesInterceptor`

Endpoints:

- `POST /upload/doc` → sube un archivo individual
- `POST /upload/docs` → sube varios archivos
- `GET /upload` → lista los archivos cargados
- `GET /upload/:filename` → descarga un archivo específico

Uso:

Este módulo es clave para integrar documentos que luego pueden ser utilizados como contexto por los modelos de IA o como entrada para validaciones y procesamiento documental.

### 4.11 Módulo local (Ollama)

Ubicación: `src/local/*`

Responsabilidades:

- consulta de modelos disponibles en Ollama
- envío de prompts a modelos locales
- informe del estado del servicio Ollama
- consulta de metadata del modelo

Endpoints:

- `POST /local` → envía un prompt al modelo local
- `GET /local/models` → lista modelos disponibles
- `GET /local/model/:modelName` → info del modelo
- `GET /local/health` → valida que el servicio de modelos está operativo

Uso:

Se usa para ejecutar IA localmente sin depender de proveedores externos. Es ideal para pruebas internas, entornos offline o baja latencia.

### 4.12 Módulo chat Gemini

Ubicación: `src/chatgemini/*`

Responsabilidades:

- invocación a Google Gemini
- envío de un prompt al modelo `gemini-2.5-flash`
- devolución de la respuesta generada

Endpoint:

- `POST /chat/flash`

Uso:

Se usa para consultas rápidas con Gemini para responder preguntas, generar texto o procesar instrucciones con una respuesta directa.

### 4.13 Módulo chat XAI

Ubicación: `src/chatxai/*`

Responsabilidades:

- segunda vía de generación con Google Gemini desde otro módulo
- expone un endpoint paralelo con el prefijo `/chat`

Endpoint:

- `POST /chat/gemini`

Uso:

Es una alternativa de integración para casos donde se quiere separar el acceso a un modelo con otra ruta o flujo funcional dentro del mismo sistema.

### 4.14 Módulo de email

Ubicación: `src/sendmail/*`

Responsabilidades:

- envío de correos por medio de Nodemailer
- manejo del caso de soporte

Endpoint:

- `POST /email/soporte`

Uso:

Se usa para enviar notificaciones, mensajes de soporte o alertas desde la API hacia un correo configurado.

### 4.15 Módulo de métricas y sesión

Ubicación: `src/metrics/session.schema.ts`

Responsabilidades:

- define el esquema de sesión para registrar propiedades como IP, fecha de conexión y tiempo de duración
- sirve como modelo para análisis o auditoría de sesiones

Aunque no se encuentra conectado directamente como módulo activo en `AppModule`, queda preparado como entidad auxiliar para trazabilidad y métricas del sistema.

## 5. Seguridad y observabilidad

El backend usa varios mecanismos de protección:

- `JwtAuthGuard` como guard global
- `@Public()` para exponer rutas públicas, como login y refresh
- `ValidationPipe` para rechazar entradas inválidas
- `LoggingInterceptor` para registrar requests y respuestas
- sanitización de tokens y contraseñas en logs
- `Throttle` en los endpoints de `auth` para limitar ataques de fuerza bruta

Esto hace que la API sea más robusta frente a errores de entrada y abuso de servicios.

## 6. Requisitos previos

Antes de correr la API debes tener instalado:

- Node.js 20+
- npm o yarn
- MongoDB Atlas o una instancia MongoDB accesible
- Redis (para refresco de tokens y blacklist)
- Ollama (opcional, si vas a usar modelos locales)
- Credenciales de Google AI / Gemini (si vas a usar `chatgemini`)
- Un servidor de correo para `sendmail`

## 7. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con variables como estas:

```env
# Base de datos
MONGODB_ATLAS_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Google Gemini
GOOGLE_API_KEY=tu_google_api_key

# Seguridad JWT
JWT_SECRET=tu_secret_muy_seguro
JWT_REFRESH_TTL=7d

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# Ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3

# Correo
GMAIL_USER=soporte@tuempresa.com
GMAIL_APP_PASSWORD=tu_contrasena_de_aplicacion

# Opcional / integraciones adicionales
GROQ_API_KEY=
OPENAI_API_KEY=
OCI_CONFIG_LOCATION=~/.oci/config
OCI_CONFIG_PROFILE=DEFAULT
OCI_COMPARTMENT_ID=
OCI_MODEL_ID=
```

## 8. Instalación

```bash
npm install
```

## 9. Ejecución

### Modo desarrollo

```bash
npm run start:dev
```

### Compilar la aplicación

```bash
npm run build
```

### Ejecutar versión de producción

```bash
npm run start:prod
```

La API corre por defecto en:

- `http://localhost:3111`
- `http://localhost:3111/docs` para Swagger

## 10. Uso básico

### Iniciar sesión

```bash
curl -X POST http://localhost:3111/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo_electronico": "usuario@empresa.com",
    "password": "tuPassword123"
  }'
```

### Consumir una respuesta con Gemini

```bash
curl -X POST http://localhost:3111/chat/flash \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explica en 3 pasos cómo puede mejorar el servicio al cliente"
  }'
```

### Subir un documento

```bash
curl -X POST http://localhost:3111/upload/doc \
  -F "file=@documento.txt"
```

### Consultar modelos locales de Ollama

```bash
curl http://localhost:3111/local/models
```

### Crear un item

```bash
curl -X POST http://localhost:3111/items \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ejemplo",
    "descripcion": "Registro de prueba"
  }'
```

## 11. Flujo de uso recomendado

1. Crear o recuperar usuarios con `/users`.
2. Iniciar sesión con `/auth/login` para obtener JWT.
3. Usar el token en el header `Authorization: Bearer <token>`.
4. Cargar documentos si el proceso requiere contexto.
5. Invocar `/chat/flash`, `/chat/gemini` o `/local` según la estrategia del modelo.
6. Guardar respuestas en `/answers` o información asociada en `/items`, `/norms` o `/reviews`.
7. Enviar notificaciones mediante `/email/soporte` cuando sea necesario.

## 12. Consideraciones importantes

- La mayoría de endpoints están protegidos por JWT.
- Las rutas públicas son únicamente las que usan el decorador `@Public()`.
- Los logs sanitizan contraseñas y tokens para evitar exposición en consola.
- La API se basa en DTOs y validación para asegurar entradas consistentes.
- El almacenamiento documental guarda archivos en la carpeta `documents` / `uploads` del proyecto según el flujo de carga.

## 13. Estado del proyecto

Este proyecto está orientado a ser una API de negocio con motores de IA integrados, enfocada en procesos de análisis, contenido y gestión documental. La estructura modular permite expandir funcionalidad sin romper la capa principal del backend.

## 14. Licencia

El proyecto usa la licencia definida en `package.json` como `PROPRIETARY`.

## 15. Autor

Proyecto desarrollado para uso interno / institucional y mantenido por el equipo del backend del sistema VigixAI.
