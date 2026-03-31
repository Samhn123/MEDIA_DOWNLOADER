FROM node:18

# Install python + pip + ffmpeg + yt-dlp
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg \
    && pip3 install yt-dlp

# App folder
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Start server
CMD ["npm", "start"]