FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist

COPY --from=build /app/build.sh ./build.sh
RUN chmod +x ./build.sh

RUN npm install -g serve
CMD ["sh", "-c", "./build.sh && serve dist -l ${PORT:-3000}"]