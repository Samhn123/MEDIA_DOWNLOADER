FROM node:18

# Install Python + pip + ffmpeg
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg

# Install yt-dlp
RUN pip3 install yt-dlp

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install node modules
RUN npm install

# Start server
CMD ["node", "backend/server.js"]