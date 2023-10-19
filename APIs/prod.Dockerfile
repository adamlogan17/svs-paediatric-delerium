# This is a more lightweight version of node
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

# Installs more llightweight dependencies
RUN npm ci

COPY . .

ARG BASE_IP=localhost
ENV BASE_IP $BASE_IP

# Install 'serve' globally
RUN npm install -g serve

# Expose port 8000
EXPOSE 8000

# Set the command to run your app using 'serve'
CMD ["npm", "run", "start:prod"]

