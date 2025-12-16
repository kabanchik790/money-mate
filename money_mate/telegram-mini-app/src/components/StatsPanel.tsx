import { formatCurrency } from '../lib/format';
import { useThemeController } from '../context/ThemeContext';

type StatsPanelProps = {
  balance: number;
  incomeTotal: number;
  expenseTotal: number;
};

export const StatsPanel = ({ balance, incomeTotal, expenseTotal }: StatsPanelProps) => {
  const { palette } = useThemeController();
  const incomeColor = palette.isDark ? '#22c55e' : '#4EBB5B';
  
  return (
    <section className="card">
      <div className="muted" style={{ marginBottom: '0rem' }}>Текущий баланс</div>
      <h2 className="title" style={{ marginBottom: '0.75rem', marginTop: '0rem', fontSize: '2.5rem', fontWeight: '700' }}>
        {formatCurrency(balance)}
      </h2>
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-label">Доходы</div>
          <div className="stat-value" style={{ color: incomeColor }}>
            {formatCurrency(incomeTotal)}
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Расходы</div>
          <div className="stat-value" style={{ color: 'var(--text-color)' }}>
            {formatCurrency(expenseTotal)}
          </div>
        </article>
      </div>
    </section>
  );
};

