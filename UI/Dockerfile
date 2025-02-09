# syntax=docker.io/docker/dockerfile:1.7-labs

FROM node:12 AS build

# Set the working directory and copy the package.json files
WORKDIR /app
COPY package*.json /app/

# # Install Ionic v3
RUN npm install -g ionic@3
RUN npm install

# Copy the rest of the application
COPY ./ /app

# Expose the port
EXPOSE 8100

# Start the application/a
CMD ["ionic", "serve", "--external"]