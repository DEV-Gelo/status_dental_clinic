# 1. Базовий образ з Node.js
FROM node:18-alpine

# 2. Робоча директорія всередині контейнера
WORKDIR /app

# 3. Копіюємо package.json і встановлюємо залежності
COPY package*.json ./
RUN npm install

# 4. Генерація Prisma клієнта
RUN npx prisma generate

# 5. Копіюємо весь проєкт у контейнер
COPY . .

# 6. Збираємо Next.js у продакшн
RUN npm run build

# 7. Відкриваємо порт
EXPOSE 3000

# 8. Запуск
CMD ["npm", "start"]

