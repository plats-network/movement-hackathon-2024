# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Install ts-node globally
RUN npm install -g ts-node

# Specify the command to run the application using ts-node
RUN npm run build

CMD ["npm", "run", "serve"]