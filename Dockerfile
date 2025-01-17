FROM node:lts
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "dist/src/index.js" ]

EXPOSE 3001
