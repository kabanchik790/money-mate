import { useState } from 'react';
import { useFinanceStore } from '../store/financeStore';

type AddWishDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const AddWishDialog = ({ open, onClose }: AddWishDialogProps) => {
  const addWish = useFinanceStore((state) => state.addWish);
  const pending = useFinanceStore((state) => state.mutationPending);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const numericValue = Number(String(amount).replace(',', '.'));
    if (!numericValue || numericValue <= 0) {
      setError('Введите сумму больше 0');
      return;
    }
    setError(null);
    await addWish({
      value: numericValue,
      what: title
    });
    setAmount('');
    setTitle('');
    onClose();
  };

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true">
      <div className="dialog">
        <h3>Новый элемент списка желаний</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Название / цель</label>
            <input
              type="text"
              placeholder="Планшет, отпуск..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="field">
            <label>Стоимость, ₽</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="Например 15000"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </div>
          {error ? <div className="error-text">{error}</div> : null}
          <button className="primary-btn" type="submit" disabled={pending}>
            Сохранить
          </button>
          <button type="button" className="outline-btn" onClick={onClose}>
            Отменить
          </button>
        </form>
      </div>
    </div>
  );
};

