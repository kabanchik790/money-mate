import { useThemeController } from '../context/ThemeContext';
import { type ThemeChoice } from '../hooks/useTelegramTheme';

const options: { label: string; value: ThemeChoice; description: string }[] = [
  { label: 'Системная', value: 'system', description: 'Использовать тему Telegram' },
  { label: 'Светлая', value: 'light', description: 'Всегда светлый режим' },
  { label: 'Тёмная', value: 'dark', description: 'Всегда тёмный режим' }
];

export const ThemeSelector = () => {
  const { choice, setChoice } = useThemeController();

  return (
    <section className="card">
      <h3 style={{ marginTop: 0 }}>Оформление</h3>
      <p className="muted" style={{ marginBottom: '1rem' }}>
        Настройте внешний вид мини-приложения.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {options.map((option) => {
          const active = option.value === choice;
          return (
            <button
              type="button"
              key={option.value}
              className={`toggle-btn ${active ? 'active' : ''}`}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left'
              }}
              onClick={() => setChoice(option.value)}
            >
              <strong>{option.label}</strong>
              <span className="muted">{option.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

