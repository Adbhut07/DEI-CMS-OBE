# Start from a base image
FROM node:18-alpine

# Install OpenSSL 1.1 and required dependencies
RUN apk add --no-cache openssl openssl-dev

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Handle the .env file - create if it doesn't exist
RUN if [ ! -f .env ]; then touch .env; fi

# Generate Prisma Client
RUN npx prisma generate

# Expose the port your app runs on
EXPOSE 8000

# Start the application
CMD ["npm", "run", "start"]