FROM node:18

# Install dependencies
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg

# Install yt-dlp
RUN pip3 install yt-dlp

# App directory
WORKDIR /app

# Copy files
COPY . .

# Install node modules
RUN npm install

# 🔥 IMPORTANT FIX (yahi main problem tha)
CMD ["node", "backend/server.js"]