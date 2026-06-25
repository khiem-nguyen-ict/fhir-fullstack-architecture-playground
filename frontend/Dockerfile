FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
CMD ["sh", "-c", "sed -i 's|%BFF_URL_INJECTION%|window.__BFF_URL__ = \"'\"${BFF_URL:-}\"'\";|' dist/index.html && serve dist -l ${PORT}"]