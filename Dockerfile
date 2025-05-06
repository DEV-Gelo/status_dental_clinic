# 1. Базовий образ з Node.js
FROM node:18-alpine

# 2. Робоча директорія всередині контейнера
WORKDIR /app

# 3. Копіюємо лише package.json і package-lock.json
COPY package*.json ./

# 4. Встановлюємо залежності
RUN npm install

# 5. Копіюємо всі файли проєкту (включаючи prisma/schema.prisma)
COPY . .

# 6. Генеруємо Prisma клієнт
RUN npx prisma generate

# 7. Збираємо Next.js у продакшн
RUN npm run build

# 8. Відкриваємо порт
EXPOSE 3000

# 9. Запуск
CMD ["npm", "start"]


