import { create } from 'zustand';
import {
  type OperationPayload,
  type OperationRecord,
  type WishPayload,
  type WishRecord
} from '../types/finance';
import { supabaseService } from '../lib/supabase';

type FinanceState = {
  operations: OperationRecord[];
  wishes: WishRecord[];
  operationsLoading: boolean;
  wishesLoading: boolean;
  mutationPending: boolean;
  error?: string;
  fetchOperations: () => Promise<void>;
  fetchWishes: () => Promise<void>;
  addOperation: (payload: OperationPayload) => Promise<void>;
  deleteOperation: (row: OperationRecord) => Promise<void>;
  addWish: (payload: WishPayload) => Promise<void>;
  deleteWish: (row: WishRecord) => Promise<void>;
  resetData: () => Promise<void>;
};

const getMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Неизвестная ошибка';

export const useFinanceStore = create<FinanceState>()((set, get) => ({
  operations: [],
  wishes: [],
  operationsLoading: false,
  wishesLoading: false,
  mutationPending: false,
  error: undefined,

  fetchOperations: async () => {
    set({ operationsLoading: true, error: undefined });
    try {
      const data = await supabaseService.getOperations();
      set({ operations: data, operationsLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: getMessage(error), operationsLoading: false });
    }
  },

  fetchWishes: async () => {
    set({ wishesLoading: true, error: undefined });
    try {
      const data = await supabaseService.getWishes();
      set({ wishes: data, wishesLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: getMessage(error), wishesLoading: false });
    }
  },

  addOperation: async ({ value, where, isIncome, date }) => {
    set({ mutationPending: true, error: undefined });
    try {
      const record = await supabaseService.addOperation({ value, where, isIncome, date });
      // Перезагружаем все операции, чтобы получить актуальные данные с правильными датами
      const allOperations = await supabaseService.getOperations();
      set({
        mutationPending: false,
        operations: allOperations
      });
    } catch (error) {
      console.error(error);
      set({ error: getMessage(error), mutationPending: false });
    }
  },

  deleteOperation: async (row) => {
    set({ mutationPending: true, error: undefined });
    try {
      await supabaseService.deleteOperation(row);
      set({
        mutationPending: false,
        operations: get().operations.filter((op) =>
          row.id ? op.id !== row.id : op.value !== row.value || op.where !== row.where
        )
      });
    } catch (error) {
      console.error(error);
      set({ error: getMessage(error), mutationPending: false });
    }
  },

  addWish: async ({ value, what }) => {
    set({ mutationPending: true, error: undefined });
    try {
      const record = await supabaseService.addWish({ value, what });
      set({
        mutationPending: false,
        wishes: [record, ...get().wishes]
      });
    } catch (error) {
      console.error(error);
      set({ error: getMessage(error), mutationPending: false });
    }
  },

  deleteWish: async (row) => {
    set({ mutationPending: true, error: undefined });
    try {
      await supabaseService.deleteWish(row);
      set({
        mutationPending: false,
        wishes: get().wishes.filter((wish) =>
          row.id ? wish.id !== row.id : wish.value !== row.value || wish.what !== row.what
        )
      });
    } catch (error) {
      console.error(error);
      set({ error: getMessage(error), mutationPending: false });
    }
  },

  resetData: async () => {
    set({
      operationsLoading: true,
      wishesLoading: true,
      mutationPending: true,
      error: undefined
    });
    try {
      await supabaseService.resetAll();
      set({
        operations: [],
        wishes: [],
        operationsLoading: false,
        wishesLoading: false,
        mutationPending: false
      });
    } catch (error) {
      console.error(error);
      set({
        error: getMessage(error),
        operationsLoading: false,
        wishesLoading: false,
        mutationPending: false
      });
    }
  }
}));

