FROM node:latest
COPY package.json package.json
RUN npm install
RUN npm audit fix
EXPOSE 3000
COPY . .
CMD ["npm", "run", "start"]