import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import dayjs from 'dayjs';
import { useFinanceStore } from '../store/financeStore';
import { StatsPanel } from '../components/StatsPanel';
import { MonthSelector } from '../components/MonthSelector';
import { OperationsList } from '../components/OperationsList';
import { AddOperationDialog } from '../components/AddOperationDialog';

const DashboardPage = () => {
  const operations = useFinanceStore((state) => state.operations);
  const loading = useFinanceStore((state) => state.operationsLoading);
  const deleteOperation = useFinanceStore((state) => state.deleteOperation);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Фильтруем операции по выбранному месяцу
  const filteredOperations = useMemo(() => {
    return operations.filter((op) => {
      if (!op.created_at) return false;
      
      // Извлекаем дату из строки (первые 10 символов: YYYY-MM-DD)
      const dateStr = op.created_at.substring(0, 10);
      const opDate = dayjs(dateStr);
      
      if (!opDate.isValid()) return false;
      
      return opDate.year() === selectedDate.year() && opDate.month() === selectedDate.month();
    });
  }, [operations, selectedDate]);

  // Доходы и расходы только для выбранного месяца
  const { income, expense } = useMemo(() => {
    const incomeTotal = filteredOperations
      .filter((op) => op.type)
      .reduce((acc, op) => acc + (op.value ?? 0), 0);
    const expenseTotal = filteredOperations
      .filter((op) => !op.type)
      .reduce((acc, op) => acc + (op.value ?? 0), 0);
    return {
      income: incomeTotal,
      expense: expenseTotal
    };
  }, [filteredOperations]);

  // Общий баланс для всех операций
  const balance = useMemo(() => {
    const incomeTotal = operations
      .filter((op) => op.type)
      .reduce((acc, op) => acc + (op.value ?? 0), 0);
    const expenseTotal = operations
      .filter((op) => !op.type)
      .reduce((acc, op) => acc + (op.value ?? 0), 0);
    return incomeTotal - expenseTotal;
  }, [operations]);

  return (
    <>
      <StatsPanel balance={balance} incomeTotal={income} expenseTotal={expense} />

      <MonthSelector
        currentDate={selectedDate}
        onDateChange={setSelectedDate}
        operationsCount={filteredOperations.length}
      />

      <h3 style={{ paddingLeft: '1.25rem', marginTop: '1.5rem', marginBottom: '1.0rem' }}>Последние операции</h3>
      <div style={{ paddingBottom: '6rem' }}>
        <OperationsList items={filteredOperations} loading={loading} onDelete={deleteOperation} />
      </div>

      <button
        className="primary-btn"
        style={{
          position: 'fixed',
          bottom: '6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '640px',
          width: 'calc(100% - 2rem)',
          zIndex: 40,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onClick={() => setDialogOpen(true)}
      >
        Добавить операцию
      </button>

      <AddOperationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};

export default DashboardPage;

