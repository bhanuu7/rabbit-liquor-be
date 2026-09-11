# 1. Base Image: Use a lightweight, stable version of Node.js
FROM node:20-alpine

# 2. Work Directory: Set the internal folder inside the container where our code will live
WORKDIR /app

# 3. Copy Package Files: Copy package.json and package-lock.json first
COPY package*.json ./

# 4. Install Dependencies: Install only production dependencies for a smaller, cleaner image
RUN npm ci --only=production

# 5. Copy Source Code: Copy the rest of your backend code into the container
COPY . .

# 6. Port Documentation: Document the port your app runs on inside the container
EXPOSE 4000

# 7. Start Command: The command Docker runs when the container starts
CMD ["node", "index.js"]