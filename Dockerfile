FROM node:14.11.0-slim

WORKDIR /yas-backend

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x run.sh

EXPOSE 3000

CMD [ "/yas-backend/run.sh" ]
