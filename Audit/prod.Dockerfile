# This is a more lightweight version of node
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

# Installs more llightweight dependencies
RUN npm ci

COPY . .

ARG REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_API_URL $REACT_APP_API_URL

RUN npm run build

# Install 'serve' globally
RUN npm install -g serve

# Expose port 80
EXPOSE 80

# Set the command to run your app using 'serve'
CMD ["serve", "-s", "/app/build", "-l", "80"]
