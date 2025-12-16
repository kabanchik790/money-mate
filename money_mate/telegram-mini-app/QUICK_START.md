# Быстрый старт с Supabase

## Минимальные шаги для запуска

### 1. Создайте проект в Supabase
- Зайдите на [supabase.com](https://supabase.com)
- Создайте новый проект (Free план)
- Скопируйте **Project URL** и **anon public** ключ из Settings > API

### 2. Создайте таблицы
В SQL Editor выполните:

```sql
CREATE TABLE money (
  id BIGSERIAL PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL,
  type INTEGER NOT NULL DEFAULT 0,
  value REAL NOT NULL DEFAULT 0,
  "where" TEXT NOT NULL DEFAULT '',
  pm TEXT NOT NULL DEFAULT '-',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shop (
  id BIGSERIAL PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL,
  what TEXT NOT NULL DEFAULT '',
  value REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_money_telegram_user_id ON money(telegram_user_id);
CREATE INDEX idx_shop_telegram_user_id ON shop(telegram_user_id);

ALTER TABLE money ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop ENABLE ROW LEVEL SECURITY;

-- Простые политики (для начала)
CREATE POLICY "Allow all" ON money FOR ALL USING (true);
CREATE POLICY "Allow all" ON shop FOR ALL USING (true);
```

### 3. Создайте .env файл
В корне проекта `telegram-mini-app` создайте `.env`:

```env
VITE_SUPABASE_URL=ваш_url
VITE_SUPABASE_ANON_KEY=ваш_ключ
```

### 4. Запустите проект
```bash
npm run dev
```

**Готово!** Подробная инструкция в [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

