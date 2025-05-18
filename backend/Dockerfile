# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.13.0

FROM node:20-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /app/backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code to the working directory
COPY . .

# Expose the port the backend listens on (assuming 5000, adjust if needed)
EXPOSE 5000

# Command to run the backend server

CMD [ "sh", "-c", "npm run import-data && npm start" ]
