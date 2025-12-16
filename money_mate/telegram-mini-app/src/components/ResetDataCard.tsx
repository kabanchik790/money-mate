import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';

export const ResetDataCard = () => {
  const resetData = useFinanceStore((state) => state.resetData);
  const pending = useFinanceStore((state) => state.mutationPending);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleReset = async () => {
    await resetData();
    setConfirmVisible(false);
  };

  return (
    <section className="card">
      <div className="chip danger">
        <AlertTriangle size={16} />
        Опасная зона
      </div>
      <h3 style={{ marginTop: '0.75rem' }}>Сбросить все данные</h3>
      <p className="muted">
        Удалит все операции, желания и суммы. Это действие нельзя отменить.
      </p>
      {confirmVisible ? (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button className="primary-btn" onClick={handleReset} disabled={pending}>
            Подтверждаю
          </button>
          <button className="outline-btn" onClick={() => setConfirmVisible(false)} disabled={pending}>
            Отмена
          </button>
        </div>
      ) : (
        <button className="primary-btn" style={{ marginTop: '1rem' }} onClick={() => setConfirmVisible(true)}>
          Сбросить данные
        </button>
      )}
    </section>
  );
};

