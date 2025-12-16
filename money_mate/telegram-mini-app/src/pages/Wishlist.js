import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency } from '../lib/format';
import { WishesList } from '../components/WishesList';
import { AddWishDialog } from '../components/AddWishDialog';
const WishlistPage = () => {
    const wishes = useFinanceStore((state) => state.wishes);
    const loading = useFinanceStore((state) => state.wishesLoading);
    const deleteWish = useFinanceStore((state) => state.deleteWish);
    const [dialogOpen, setDialogOpen] = useState(false);
    const total = useMemo(() => wishes.reduce((acc, wish) => acc + (wish.value ?? 0), 0), [wishes]);
    return (_jsxs(_Fragment, { children: [_jsx("h1", { className: "title", style: { paddingLeft: '1.25rem', marginBottom: '1.25rem' }, children: "\u041F\u043B\u0430\u043D\u044B \u0438 \u0446\u0435\u043B\u0438" }), _jsxs("section", { className: "card", children: [_jsxs("div", { className: "chip", children: [_jsx(Heart, { size: 16 }), "\u041E\u0431\u0449\u0430\u044F \u0441\u0443\u043C\u043C\u0430 \u0436\u0435\u043B\u0430\u043D\u0438\u0439"] }), _jsx("h2", { className: "title", style: { marginTop: '0.5rem', marginBottom: '0rem', fontSize: '2.5rem', fontWeight: '700' }, children: formatCurrency(total) })] }), _jsx("h3", { style: { paddingLeft: '1.25rem', marginTop: '1.5rem', marginBottom: '1.0rem' }, children: "\u0416\u0435\u043B\u0430\u043D\u0438\u044F" }), _jsx(WishesList, { items: wishes, loading: loading, onDelete: deleteWish }), _jsx("button", { className: "primary-btn", style: { marginTop: '1.5rem' }, onClick: () => setDialogOpen(true), children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0436\u0435\u043B\u0430\u043D\u0438\u0435" }), _jsx(AddWishDialog, { open: dialogOpen, onClose: () => setDialogOpen(false) })] }));
};
export default WishlistPage;
