FROM node:14.11.0-slim as builder

WORKDIR /

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# executable
FROM node:14.11.0-slim

WORKDIR /app
COPY --from=builder /dist .
COPY --from=builder /node_modules ./node_modules

EXPOSE 3000

ENTRYPOINT ["node", "app.js"]
