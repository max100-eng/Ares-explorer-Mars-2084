# --- Etapa 1: Builder (Construcción) ---
# Usamos una imagen base completa para instalar dependencias y compilar
FROM node:20-slim AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de dependencias
COPY package.json package-lock.json ./

# Instala todas las dependencias
RUN npm install

# *** CORRECCIÓN CRUCIAL PARA LA EJECUCIÓN: INSTALAR 'serve' globalmente ***
# Esto asegura que el comando 'npx serve' funcione en la etapa final (runner).
RUN npm install -g serve

# Copia el código fuente completo al contenedor
COPY . .

# Ejecuta el script de compilación (esto crea la carpeta 'dist')
RUN npm run build


# --- Etapa 2: Runner (Ejecución) ---
# Usamos una imagen base más ligera para la imagen final de ejecución
FROM node:20-slim AS runner

# Establece el directorio de trabajo
WORKDIR /app

# Cloud Run escucha por defecto en el puerto 8080.
# La variable $PORT será pasada automáticamente por el entorno de ejecución.
ENV PORT 8080

# Copia solo los módulos de producción y la carpeta 'dist' ya compilada
COPY --from=builder /usr/local/lib/node_modules/serve /usr/local/lib/node_modules/serve
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# *** CORRECCIÓN FINAL DE INICIO: Usar npx serve -l $PORT ***
# Esto inicia el servidor estático 'serve' y lo fuerza a escuchar en el puerto $PORT (8080).
CMD ["npx", "serve", "-s", "dist", "-l", "$PORT"]