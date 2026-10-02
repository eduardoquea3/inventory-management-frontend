FROM oven/bun:1.4.2-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN bun run build

FROM nginx:stable-alpine

ENV BACKEND_DNS_RESOLVER=10.89.1.1 \
    NGINX_ENVSUBST_FILTER=^BACKEND_DNS_RESOLVER

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
