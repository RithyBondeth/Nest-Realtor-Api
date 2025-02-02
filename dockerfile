# Use the official Node.js 18 image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into working directory /app
COPY package*.json ./

# Install all application dependencies
RUN npm install

# Copy the rest of the application code into working directory /app
COPY . .

# Copy the .env file
COPY .env .env

# Gnerate prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on port 3000
EXPOSE 3000
# Define the command to run the app
CMD ["npm", "run", "start:prod"]