# Etapa 1: Compilar Angular
FROM node:18 AS builder

WORKDIR /app

# Copiar archivos de configuración de npm
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Compilar la aplicación Angular para producción
RUN npm run build -- --configuration production

# Verificar que los archivos se generaron correctamente
RUN ls -la dist/

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos compilados de Angular
# En versiones recientes de Angular, los archivos están en dist/portfolio-app/browser
COPY --from=builder /app/dist/portfolio-app/browser /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]
