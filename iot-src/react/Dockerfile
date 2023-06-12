FROM node:alpine
WORKDIR '/usr/src/app/react'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]