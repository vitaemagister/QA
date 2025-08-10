# Взяти офіційний Node.js образ
FROM node:18-alpine

# Встановити робочу директорію
WORKDIR /app

# Копіюємо package.json і package-lock.json (якщо є)
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо решту файлів (server.js тощо)
COPY . .

# Відкриваємо порт 3000
EXPOSE 3000

# Команда запуску API
CMD ["npm", "start"]
