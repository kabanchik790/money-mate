const currencyFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
});
const numberFormatter = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0
});
export const formatCurrency = (value) => currencyFormatter.format(value);
export const formatNumber = (value) => numberFormatter.format(value);
