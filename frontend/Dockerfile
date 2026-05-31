# ── Stage 1: Build React App ───────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching)
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .

# Create .env for build
RUN echo "VITE_API_BASE_URL=http://localhost:8080" > .env
RUN echo "VITE_NOTIFICATION_WS_URL=http://localhost:8084" >> .env
RUN echo "VITE_AI_WS_URL=http://localhost:8085" >> .env

RUN npm run build

# ── Stage 2: Serve with Nginx ──────────────────────
# Nginx serves the built React files
# Much faster and lighter than Node for serving static files
FROM nginx:alpine

# Copy built files to Nginx's serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx config for React Router support
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
