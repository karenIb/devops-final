FROM node:14-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY test.js .
CMD ["npm", "test"]
