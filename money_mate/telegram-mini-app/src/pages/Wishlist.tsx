import { useMemo, useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency } from '../lib/format';
import { WishesList } from '../components/WishesList';
import { AddWishDialog } from '../components/AddWishDialog';

const WishlistPage = () => {
  const wishes = useFinanceStore((state) => state.wishes);
  const loading = useFinanceStore((state) => state.wishesLoading);
  const deleteWish = useFinanceStore((state) => state.deleteWish);
  const [dialogOpen, setDialogOpen] = useState(false);

  const total = useMemo(
    () => wishes.reduce((acc, wish) => acc + (wish.value ?? 0), 0),
    [wishes]
  );

  return (
    <>
      <h1 className="title" style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem' }}>Планы и цели</h1>

      <section className="card">
        <div className="chip">
          <Heart size={16} />
          Общая сумма желаний
        </div>
        <h2 className="title" style={{ marginTop: '0.5rem', marginBottom: '0rem', fontSize: '2.5rem', fontWeight: '700' }}>
          {formatCurrency(total)}
        </h2>
      </section>

      <h3 style={{ paddingLeft: '1.25rem', marginTop: '1.5rem', marginBottom: '1.0rem'}}>Желания</h3>
      <WishesList items={wishes} loading={loading} onDelete={deleteWish} />

      <button className="primary-btn" style={{ marginTop: '1.5rem' }} onClick={() => setDialogOpen(true)}>
        Добавить желание
      </button>

      <AddWishDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};

export default WishlistPage;

