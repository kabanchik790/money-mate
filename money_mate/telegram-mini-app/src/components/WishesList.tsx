import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../lib/format';
import { type WishRecord } from '../types/finance';

dayjs.extend(localizedFormat);
dayjs.locale('ru');

type WishesListProps = {
  items: WishRecord[];
  loading?: boolean;
  onDelete: (wish: WishRecord) => void;
};

export const WishesList = ({ items, loading, onDelete }: WishesListProps) => {
  if (loading) {
    return <div className="card">Загружаем желания...</div>;
  }

  if (!items.length) {
    return (
      <div className="card empty-state">
        Список пуст. Добавьте желаемую покупку через кнопку ниже.
      </div>
    );
  }

  return (
    <div className="card">
      <div className="list">
        {items.map((wish) => {
          const date = wish.created_at ? dayjs(wish.created_at).format('DD MMM, HH:mm') : '—';
          return (
            <div
              className="list-item"
              key={`${wish.id ?? wish.what}-${wish.what}-${wish.value}-${wish.created_at}`}
            >
              <div>
                <div className="list-item__title">{wish.what}</div>
                <div className="list-item__subtitle">{date}</div>
              </div>
              <div className="actions">
                <div className="list-item__value">{formatCurrency(wish.value)}</div>
                <button
                  onClick={() => onDelete(wish)}
                  aria-label="Удалить желание"
                  style={{ color: '#475569' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

