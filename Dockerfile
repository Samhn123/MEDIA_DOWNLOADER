FROM python:3.11-slim

# 🔥 Node.js install
RUN apt-get update && apt-get install -y \
    curl \
    ffmpeg \
    nodejs \
    npm

# 🔥 yt-dlp install
RUN pip install -U yt-dlp

WORKDIR /app

# 🔥 package.json copy
COPY package*.json ./

# 🔥 npm install (अब काम करेगा)
RUN npm install

# 🔥 बाकी files copy
COPY . .

# 🔥 start app
CMD ["npm", "start"]