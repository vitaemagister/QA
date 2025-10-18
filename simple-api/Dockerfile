# Використовуємо офіційний Node образ
FROM node:18

# Створюємо робочу директорію
WORKDIR /app

# Копіюємо package.json (якщо є)
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо увесь код
COPY . .

# Відкриваємо порт
EXPOSE 3000

# Запуск
CMD ["node", "index.js"]
