import { useEffect, useMemo, useState } from 'react';
import WebApp from '@twa-dev/sdk';

export type ThemeChoice = 'system' | 'light' | 'dark';

type ThemeParams = typeof WebApp.themeParams;

export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
};

export interface ThemePalette {
  isDark: boolean;
  background: string;
  card: string;
  cardMuted: string;
  text: string;
  textMuted: string;
  accent: string;
  accentMuted: string;
}

export interface ThemeController {
  palette: ThemePalette;
  choice: ThemeChoice;
  setChoice: (choice: ThemeChoice) => void;
  telegramUser?: TelegramUser;
}

const STORAGE_KEY = 'money-mate-theme';

const FALLBACK_PALETTE: ThemePalette = {
  isDark: false,
  background: '#f5f5fa',
  card: '#ffffff',
  cardMuted: '#f9f9ff',
  text: '#0f172a',
  textMuted: '#475569',
  accent: '#8462F4',
  accentMuted: '#c8b9ff'
};

const ensureWebAppReady = () => {
  try {
    WebApp.ready();
    WebApp.expand();
  } catch (_) {
    // noop outside Telegram
  }
};

type ThemeParamsExtended = ThemeParams & {
  color_scheme?: string;
  colorScheme?: string;
};

export const useTelegramTheme = (): ThemeController => {
  const [choice, setChoice] = useState<ThemeChoice>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }
    return (localStorage.getItem(STORAGE_KEY) as ThemeChoice) ?? 'system';
  });
  const [themeParams, setThemeParams] = useState(() => {
    try {
      return WebApp.themeParams;
    } catch (_) {
      return undefined;
    }
  });
  const [telegramUser] = useState<TelegramUser | undefined>(() => {
    try {
      const user = WebApp.initDataUnsafe?.user;
      if (!user) return undefined;
      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username
      };
    } catch (_) {
      return undefined;
    }
  });

  useEffect(() => {
    ensureWebAppReady();
    const handler = () => {
      try {
        setThemeParams({ ...WebApp.themeParams });
      } catch (_) {
        setThemeParams(undefined);
      }
    };
    WebApp.onEvent?.('themeChanged', handler);
    return () => {
      WebApp.offEvent?.('themeChanged', handler);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, choice);
    }
  }, [choice]);

  const palette = useMemo<ThemePalette>(() => {
    const extended = themeParams as ThemeParamsExtended | undefined;
    const colorScheme = extended?.color_scheme ?? extended?.colorScheme;
    const systemPrefersDark =
      colorScheme === 'dark' ||
      (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    const isDark = choice === 'dark' || (choice === 'system' && systemPrefersDark);
    return {
      isDark,
      background: isDark
        ? themeParams?.secondary_bg_color ?? '#07070d'
        : themeParams?.secondary_bg_color ?? '#f5f5fa',
      card: isDark ? themeParams?.bg_color ?? '#11111a' : themeParams?.bg_color ?? '#ffffff',
      cardMuted: isDark ? '#1b1b26' : '#f1f0ff',
      text: isDark ? themeParams?.text_color ?? '#f8fafc' : themeParams?.text_color ?? '#0f172a',
      textMuted: isDark ? '#cbd5f5' : '#475569',
      accent: themeParams?.button_color ?? '#8462F4',
      accentMuted: themeParams?.button_text_color ?? '#ffffff'
    };
  }, [choice, themeParams]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', palette.background);
    root.style.setProperty('--card-color', palette.card);
    root.style.setProperty('--card-muted', palette.cardMuted);
    root.style.setProperty('--text-color', palette.text);
    root.style.setProperty('--text-muted', palette.textMuted);
    root.style.setProperty('--accent-color', palette.accent);
    root.style.setProperty('--accent-contrast', palette.accentMuted);
  }, [palette]);

  return {
    palette: palette ?? FALLBACK_PALETTE,
    choice,
    setChoice,
    telegramUser
  };
};

