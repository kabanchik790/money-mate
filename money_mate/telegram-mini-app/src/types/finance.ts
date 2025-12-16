export type OperationRecord = {
  id: number;
  created_at?: string;
  type: boolean;
  value: number;
  where: string;
  pm: '+' | '-';
};

export type WishRecord = {
  id: number;
  created_at?: string;
  what: string;
  value: number;
};

export type OperationPayload = {
  value: number;
  where: string;
  isIncome: boolean;
  date?: string; // ISO date string (YYYY-MM-DD) или undefined для текущей даты
};

export type WishPayload = {
  value: number;
  what: string;
};

