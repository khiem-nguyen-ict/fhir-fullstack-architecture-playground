FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY . .
COPY build.sh build.sh
RUN chmod +x ./build.sh
EXPOSE 4000
CMD ["./build.sh", "npm", "start"]
