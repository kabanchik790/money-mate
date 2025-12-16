import { createClient } from '@supabase/supabase-js';
import WebApp from '@twa-dev/sdk';
import {
  type OperationPayload,
  type OperationRecord,
  type WishPayload,
  type WishRecord
} from '../types/finance';

// Получаем ключи из переменных окружения
// В продакшене эти значения должны быть в .env файле
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file'
  );
}

// Создаем клиент Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // Не сохраняем сессию, используем Telegram авторизацию
    autoRefreshToken: false
  }
});

/**
 * Получает Telegram User ID из текущего контекста
 * Используется для фильтрации данных по пользователю
 */
const getTelegramUserId = (): number | null => {
  try {
    if (typeof window === 'undefined') return null;
    // Пытаемся получить из Telegram WebApp
    const user = WebApp.initDataUnsafe?.user;
    if (user?.id) {
      return user.id;
    }
    // Fallback: можно получить из localStorage если сохраняли
    const saved = localStorage.getItem('telegram_user_id');
    return saved ? Number(saved) : null;
  } catch {
    return null;
  }
};

/**
 * Сохраняет Telegram User ID для использования в запросах
 */
export const setTelegramUserId = (userId: number) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('telegram_user_id', String(userId));
  }
};

export const supabaseService = {
  /**
   * Получает все операции пользователя
   */
  async getOperations(): Promise<OperationRecord[]> {
    const userId = getTelegramUserId();
    if (!userId) {
      console.warn('Telegram User ID not found');
      return [];
    }

    const { data, error } = await supabase
      .from('money')
      .select('*')
      .eq('telegram_user_id', userId)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching operations:', error);
      throw new Error(error.message);
    }

    return (data || []).map((row) => ({
      id: row.id,
      type: Boolean(row.type),
      value: Number(row.value ?? 0),
      where: String(row.where ?? ''),
      pm: (row.pm === '-' ? '-' : '+') as '+' | '-',
      created_at: row.created_at ? String(row.created_at) : undefined
    }));
  },

  /**
   * Получает все желания пользователя
   */
  async getWishes(): Promise<WishRecord[]> {
    const userId = getTelegramUserId();
    if (!userId) {
      console.warn('Telegram User ID not found');
      return [];
    }

    const { data, error } = await supabase
      .from('shop')
      .select('*')
      .eq('telegram_user_id', userId)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching wishes:', error);
      throw new Error(error.message);
    }

    return (data || []).map((row) => ({
      id: row.id,
      what: String(row.what ?? ''),
      value: Number(row.value ?? 0),
      created_at: row.created_at ? String(row.created_at) : undefined
    }));
  },

  /**
   * Добавляет новую операцию
   */
  async addOperation(payload: OperationPayload): Promise<OperationRecord> {
    const userId = getTelegramUserId();
    if (!userId) {
      throw new Error('Telegram User ID not found');
    }

    // Формируем дату и время
    let createdAt: string;
    if (payload.date) {
      createdAt = `${payload.date} 12:00:00`;
    } else {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      createdAt = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const { data, error } = await supabase
      .from('money')
      .insert({
        telegram_user_id: userId,
        type: payload.isIncome ? 1 : 0,
        value: payload.value,
        where: payload.where.trim() || '-',
        pm: payload.isIncome ? '+' : '-',
        created_at: createdAt
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding operation:', error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      type: Boolean(data.type),
      value: Number(data.value ?? 0),
      where: String(data.where ?? ''),
      pm: (data.pm === '-' ? '-' : '+') as '+' | '-',
      created_at: data.created_at ? String(data.created_at) : undefined
    };
  },

  /**
   * Удаляет операцию
   */
  async deleteOperation(row: OperationRecord): Promise<void> {
    const userId = getTelegramUserId();
    if (!userId) {
      throw new Error('Telegram User ID not found');
    }

    const { error } = await supabase
      .from('money')
      .delete()
      .eq('id', row.id)
      .eq('telegram_user_id', userId); // Дополнительная проверка безопасности

    if (error) {
      console.error('Error deleting operation:', error);
      throw new Error(error.message);
    }
  },

  /**
   * Добавляет новое желание
   */
  async addWish(payload: WishPayload): Promise<WishRecord> {
    const userId = getTelegramUserId();
    if (!userId) {
      throw new Error('Telegram User ID not found');
    }

    const { data, error } = await supabase
      .from('shop')
      .insert({
        telegram_user_id: userId,
        what: payload.what.trim() || '-',
        value: payload.value
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding wish:', error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      what: String(data.what ?? ''),
      value: Number(data.value ?? 0),
      created_at: data.created_at ? String(data.created_at) : undefined
    };
  },

  /**
   * Удаляет желание
   */
  async deleteWish(row: WishRecord): Promise<void> {
    const userId = getTelegramUserId();
    if (!userId) {
      throw new Error('Telegram User ID not found');
    }

    const { error } = await supabase
      .from('shop')
      .delete()
      .eq('id', row.id)
      .eq('telegram_user_id', userId); // Дополнительная проверка безопасности

    if (error) {
      console.error('Error deleting wish:', error);
      throw new Error(error.message);
    }
  },

  /**
   * Удаляет все данные пользователя
   */
  async resetAll(): Promise<void> {
    const userId = getTelegramUserId();
    if (!userId) {
      throw new Error('Telegram User ID not found');
    }

    // Удаляем операции и желания в транзакции
    const [operationsError, wishesError] = await Promise.all([
      supabase.from('money').delete().eq('telegram_user_id', userId),
      supabase.from('shop').delete().eq('telegram_user_id', userId)
    ]);

    if (operationsError.error) {
      console.error('Error deleting operations:', operationsError.error);
      throw new Error(operationsError.error.message);
    }

    if (wishesError.error) {
      console.error('Error deleting wishes:', wishesError.error);
      throw new Error(wishesError.error.message);
    }
  }
};

