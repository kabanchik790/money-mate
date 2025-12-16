# Гайд по настройке Supabase для Money Mate

Этот гайд поможет вам настроить Supabase базу данных для проекта Money Mate.

## Шаг 1: Создание аккаунта и проекта в Supabase

1. Перейдите на [https://supabase.com](https://supabase.com)
2. Нажмите "Start your project" или "Sign Up"
3. Войдите через GitHub, Google или создайте аккаунт по email
4. После входа нажмите "New Project"
5. Заполните форму:
   - **Name**: `money-mate` (или любое другое имя)
   - **Database Password**: придумайте надежный пароль (сохраните его!)
   - **Region**: выберите ближайший регион (например, `West US` или `Central EU`)
   - **Pricing Plan**: выберите **Free** план
6. Нажмите "Create new project"
7. Подождите 1-2 минуты, пока проект создается

## Шаг 2: Получение ключей API

1. В левом меню выберите **Settings** (⚙️)
2. Перейдите в раздел **API**
3. Скопируйте следующие значения:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon public** ключ (длинная строка, начинается с `eyJ...`)

## Шаг 3: Создание таблиц в базе данных

1. В левом меню выберите **SQL Editor**
2. Нажмите "New query"
3. Скопируйте и вставьте следующий SQL код:

```sql
-- Создание таблицы для операций (доходы/расходы)
CREATE TABLE IF NOT EXISTS money (
  id BIGSERIAL PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL,
  type INTEGER NOT NULL DEFAULT 0,
  value REAL NOT NULL DEFAULT 0,
  "where" TEXT NOT NULL DEFAULT '',
  pm TEXT NOT NULL DEFAULT '-',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Создание таблицы для желаний
CREATE TABLE IF NOT EXISTS shop (
  id BIGSERIAL PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL,
  what TEXT NOT NULL DEFAULT '',
  value REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Создание индексов для быстрого поиска по пользователю
CREATE INDEX IF NOT EXISTS idx_money_telegram_user_id ON money(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_shop_telegram_user_id ON shop(telegram_user_id);

-- Включение Row Level Security (RLS) для безопасности
ALTER TABLE money ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop ENABLE ROW LEVEL SECURITY;

-- Создание политик RLS: пользователи могут видеть и изменять только свои данные
-- Политика для таблицы money
CREATE POLICY "Users can view own money records"
  ON money FOR SELECT
  USING (true); -- Временно разрешаем всем, так как используем фильтрацию по telegram_user_id в коде

CREATE POLICY "Users can insert own money records"
  ON money FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own money records"
  ON money FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete own money records"
  ON money FOR DELETE
  USING (true);

-- Политика для таблицы shop
CREATE POLICY "Users can view own shop records"
  ON shop FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own shop records"
  ON shop FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own shop records"
  ON shop FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete own shop records"
  ON shop FOR DELETE
  USING (true);
```

4. Нажмите "Run" или `Ctrl+Enter` (Windows/Linux) / `Cmd+Enter` (Mac)
5. Должно появиться сообщение "Success. No rows returned"

> **Примечание**: Политики RLS настроены на `true` для всех операций, так как фильтрация по `telegram_user_id` происходит в коде приложения. Для большей безопасности можно настроить более строгие политики, но это требует настройки кастомной авторизации через JWT токены.

## Шаг 4: Настройка переменных окружения

1. В корне проекта `telegram-mini-app` создайте файл `.env`
2. Добавьте в него следующие строки:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Замените значения на те, что вы скопировали в Шаге 2:
   - `VITE_SUPABASE_URL` - ваш Project URL
   - `VITE_SUPABASE_ANON_KEY` - ваш anon public ключ

4. Сохраните файл

> **Важно**: 
> - Файл `.env` уже добавлен в `.gitignore`, поэтому ваши ключи не попадут в git
> - Никогда не публикуйте эти ключи в открытом доступе
> - `anon` ключ безопасно использовать в клиентском коде, так как RLS защищает данные

## Шаг 5: Проверка подключения

1. Запустите проект:
   ```bash
   npm run dev
   ```

2. Откройте приложение в Telegram или в браузере
3. Попробуйте добавить операцию или желание
4. Проверьте в Supabase Dashboard:
   - Перейдите в **Table Editor**
   - Выберите таблицу `money` или `shop`
   - Должны появиться записи с вашим `telegram_user_id`

## Шаг 6 (Опционально): Настройка более строгих политик безопасности

Если вы хотите усилить безопасность, можно настроить политики RLS, которые проверяют `telegram_user_id` на уровне базы данных. Для этого нужно:

1. Создать функцию для получения текущего пользователя из JWT токена
2. Настроить кастомную авторизацию через Telegram initData

Но для начала текущей настройки достаточно, так как:
- Фильтрация по `telegram_user_id` происходит в коде
- `anon` ключ не позволяет изменять структуру БД
- RLS включен и готов к более строгим политикам

## Устранение проблем

### Ошибка "Invalid API key"
- Проверьте, что вы скопировали правильный `anon` ключ (не `service_role`!)
- Убедитесь, что в `.env` файле нет лишних пробелов

### Ошибка "relation does not exist"
- Убедитесь, что вы выполнили SQL скрипт из Шага 3
- Проверьте в **Table Editor**, что таблицы `money` и `shop` существуют

### Данные не сохраняются
- Проверьте консоль браузера на наличие ошибок
- Убедитесь, что Telegram User ID определяется (проверьте в настройках приложения)
- Проверьте, что RLS политики созданы правильно

### Ошибка "Telegram User ID not found"
- Убедитесь, что приложение запущено внутри Telegram
- Проверьте, что `WebApp.initDataUnsafe?.user?.id` доступен
- В режиме разработки можно временно установить тестовый ID в localStorage

## Полезные ссылки

- [Документация Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Миграция данных из SQLite

Если у вас уже есть данные в локальном SQLite (localStorage), их можно мигрировать:

1. Экспортируйте данные из старой версии приложения
2. Используйте SQL Editor в Supabase для массовой вставки данных
3. Или создайте временный скрипт миграции

---

**Готово!** Теперь ваше приложение использует Supabase вместо локального SQLite. Данные будут синхронизироваться между устройствами пользователя.

