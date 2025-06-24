FROM node:current-alpine
EXPOSE 3000
COPY . ./program
WORKDIR /program
RUN npm i
RUN npm audit fix --force || true
CMD ["npm", "run", "start"]