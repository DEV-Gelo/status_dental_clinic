# 1. Базовий образ з Node.js
FROM node:18-alpine

# 2. Робоча директорія всередині контейнера
WORKDIR /app

# 3. Копіюємо package.json і встановлюємо залежності
COPY package*.json ./
RUN npm install

# 4. Копіюємо весь проєкт у контейнер
COPY . .

# 5. Збираємо Next.js у продакшн
RUN npm run build

# 6. Відкриваємо порт
EXPOSE 3000

# 7. Запуск
CMD ["npm", "start"]
