import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import {
  type OperationPayload,
  type OperationRecord,
  type WishPayload,
  type WishRecord
} from '../types/finance';

const STORAGE_KEY = 'money-mate-sqlite';
const SQL_JS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2';

let sqlPromise: Promise<SqlJsStatic> | null = null;
let dbInstance: Database | null = null;

const hasWindow = typeof window !== 'undefined';

const locateFile = (file: string) => {
  if (file === 'sql-wasm.wasm') {
    return wasmUrl;
  }
  return `${SQL_JS_CDN}/${file}`;
};

const getSqlModule = () => {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({ locateFile });
  }
  return sqlPromise;
};

type BufferGlobal = {
  from: (...args: any[]) => any;
};

const getGlobalBuffer = () =>
  (globalThis as typeof globalThis & { Buffer?: BufferGlobal }).Buffer;

const base64ToUint8Array = (base64: string): Uint8Array => {
  if (typeof atob === 'function') {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  const BufferCtor = getGlobalBuffer();
  if (BufferCtor) {
    const buffer = BufferCtor.from(base64, 'base64');
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }
  throw new Error('Base64 decoding недоступно в этом окружении');
};

const uint8ArrayToBase64 = (data: Uint8Array): string => {
  if (typeof btoa === 'function') {
    let binary = '';
    for (let i = 0; i < data.length; i += 1) {
      binary += String.fromCharCode(data[i]);
    }
    return btoa(binary);
  }
  const BufferCtor = getGlobalBuffer();
  if (BufferCtor) {
    return BufferCtor.from(data).toString('base64');
  }
  throw new Error('Base64 encoding недоступно в этом окружении');
};

const readDatabaseFromStorage = (): Uint8Array | null => {
  if (!hasWindow) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? base64ToUint8Array(raw) : null;
  } catch (error) {
    console.warn('Не удалось загрузить локальную БД', error);
    return null;
  }
};

const persistDatabase = () => {
  if (!hasWindow || !dbInstance) return;
  try {
    const data = dbInstance.export();
    window.localStorage.setItem(STORAGE_KEY, uint8ArrayToBase64(data));
  } catch (error) {
    console.warn('Не удалось сохранить локальную БД', error);
  }
};

const initializeSchema = (db: Database, shouldPersist: boolean) => {
  db.run(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS Money (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type INTEGER NOT NULL,
      value REAL NOT NULL DEFAULT 0,
      "where" TEXT NOT NULL,
      pm TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS shop (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      what TEXT NOT NULL,
      value REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  if (shouldPersist) {
    persistDatabase();
  }
};

const getDatabase = async (): Promise<Database> => {
  if (dbInstance) return dbInstance;
  const SQL = await getSqlModule();
  const saved = readDatabaseFromStorage();
  dbInstance = saved ? new SQL.Database(saved) : new SQL.Database();
  initializeSchema(dbInstance, !saved);
  return dbInstance;
};

type SqlRow = Record<string, unknown>;

const mapOperation = (row: SqlRow): OperationRecord => ({
  id: Number(row.id),
  type: Boolean(row.type),
  value: Number(row.value ?? 0),
  where: String(row['where'] ?? row.where ?? ''),
  pm: (row.pm === '-' ? '-' : '+') as '+' | '-',
  created_at: typeof row.created_at === 'string' ? row.created_at : undefined
});

const mapWish = (row: SqlRow): WishRecord => ({
  id: Number(row.id),
  what: String(row.what ?? ''),
  value: Number(row.value ?? 0),
  created_at: typeof row.created_at === 'string' ? row.created_at : undefined
});

const queryAll = <T extends SqlRow>(db: Database, sql: string, params: (string | number)[] = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return rows;
};

const queryOne = <T extends SqlRow>(db: Database, sql: string, params: (string | number)[] = []) => {
  const [row] = queryAll<T>(db, sql, params);
  return row ?? null;
};

const deleteWithFallback = (db: Database, table: string, id?: number, fallback?: { fields: string[]; values: (string | number)[] }) => {
  if (id) {
    const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
    stmt.run([id]);
    stmt.free();
    return;
  }
  if (fallback) {
    const conditions = fallback.fields.map((field) => `${field} = ?`).join(' AND ');
    const stmt = db.prepare(
      `DELETE FROM ${table} WHERE rowid IN (
        SELECT rowid FROM ${table} WHERE ${conditions} LIMIT 1
      )`
    );
    stmt.run(fallback.values);
    stmt.free();
  }
};

export const sqliteService = {
  async getOperations(): Promise<OperationRecord[]> {
    const db = await getDatabase();
    return queryAll(db, 'SELECT * FROM Money ORDER BY id DESC').map(mapOperation);
  },

  async getWishes(): Promise<WishRecord[]> {
    const db = await getDatabase();
    return queryAll(db, 'SELECT * FROM shop ORDER BY id DESC').map(mapWish);
  },

  async addOperation(payload: OperationPayload): Promise<OperationRecord> {
    const db = await getDatabase();
    
    // Формируем дату и время для created_at в локальном времени
    let createdAt: string;
    if (payload.date) {
      // Если указана дата, устанавливаем время на полдень (12:00:00) в локальном времени
      // Формат: YYYY-MM-DD HH:mm:ss (локальное время)
      createdAt = `${payload.date} 12:00:00`;
    } else {
      // Если дата не указана, используем текущую дату и время в локальном формате
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      createdAt = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    const stmt = db.prepare('INSERT INTO Money (type, value, "where", pm, created_at) VALUES (?, ?, ?, ?, ?)');
    stmt.run([
      payload.isIncome ? 1 : 0,
      payload.value,
      payload.where.trim() || '-',
      payload.isIncome ? '+' : '-',
      createdAt
    ]);
    stmt.free();
    const row = queryOne<SqlRow>(db, 'SELECT * FROM Money WHERE id = last_insert_rowid()');
    persistDatabase();
    const mapped = mapOperation(row ?? {});
    // Отладка: проверяем что дата сохранилась правильно
    console.log('Добавлена операция:', {
      selectedDate: payload.date,
      savedDate: mapped.created_at,
      operation: mapped
    });
    return mapped;
  },

  async deleteOperation(row: OperationRecord): Promise<void> {
    const db = await getDatabase();
    deleteWithFallback(db, 'Money', row.id, {
      fields: ['value', '"where"'],
      values: [row.value, row.where]
    });
    persistDatabase();
  },

  async addWish(payload: WishPayload): Promise<WishRecord> {
    const db = await getDatabase();
    const stmt = db.prepare('INSERT INTO shop (what, value) VALUES (?, ?)');
    stmt.run([payload.what.trim() || '-', payload.value]);
    stmt.free();
    const row = queryOne<SqlRow>(db, 'SELECT * FROM shop WHERE id = last_insert_rowid()');
    persistDatabase();
    return mapWish(row ?? {});
  },

  async deleteWish(row: WishRecord): Promise<void> {
    const db = await getDatabase();
    deleteWithFallback(db, 'shop', row.id, {
      fields: ['what', 'value'],
      values: [row.what, row.value]
    });
    persistDatabase();
  },

  async resetAll(): Promise<void> {
    const db = await getDatabase();
    db.run('DELETE FROM Money; DELETE FROM shop;');
    persistDatabase();
  }
};

