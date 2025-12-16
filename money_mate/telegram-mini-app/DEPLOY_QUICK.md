# Быстрый деплой Telegram Mini App

## Минимальные шаги (5 минут)

### 1. Подготовка (1 мин)
```bash
cd telegram-mini-app
npm run build  # Проверьте, что сборка работает
```

### 2. Деплой на Vercel (2 мин)

1. Зайдите на [vercel.com](https://vercel.com) → Войдите через GitHub
2. **Add New Project** → Выберите репозиторий
3. Настройки:
   - **Root Directory**: `money_mate/telegram-mini-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_SUPABASE_URL` = ваш URL
   - `VITE_SUPABASE_ANON_KEY` = ваш ключ
5. **Deploy** → Скопируйте URL (например: `https://money-mate-xxx.vercel.app`)

### 3. Настройка Telegram Bot (2 мин)

1. Откройте [@BotFather](https://t.me/BotFather)
2. `/newbot` → Создайте бота
3. `/newapp` → Выберите бота
4. Заполните:
   - **Title**: Money Mate
   - **Short name**: moneymate
   - **Web App URL**: вставьте URL из Vercel
5. Готово! Ссылка: `https://t.me/ваш_бот/moneymate`

---

## Альтернативы Vercel

### Netlify
1. [netlify.com](https://netlify.com) → Import project
2. Base directory: `money_mate/telegram-mini-app`
3. Build: `npm run build`, Publish: `dist`
4. Добавьте Environment Variables

### GitHub Pages
1. Создайте `.github/workflows/deploy.yml` (см. DEPLOYMENT.md)
2. Добавьте Secrets в GitHub
3. Включите Pages в Settings

---

## Проверка

1. Откройте бота в Telegram
2. Нажмите кнопку "Mini App"
3. Проверьте, что всё работает

**Проблемы?** Смотрите [DEPLOYMENT.md](./DEPLOYMENT.md) для подробной инструкции.

