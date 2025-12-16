import { useThemeController } from '../context/ThemeContext';
import { ThemeSelector } from '../components/ThemeSelector';
import { ResetDataCard } from '../components/ResetDataCard';

const SettingsPage = () => {
  const { telegramUser } = useThemeController();

  return (
    <>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Telegram</h3>
        {telegramUser ? (
          <>
            <div className="list-item__title">
              {telegramUser.first_name} {telegramUser.last_name ?? ''}
            </div>
            <div className="muted">@{telegramUser.username ?? 'без никнейма'}</div>
            <p className="muted" style={{ marginTop: '0.5rem' }}>
              ID пользователя: {telegramUser.id}
            </p>
          </>
        ) : (
          <p className="muted">Запустить мини-приложение внутри Telegram, чтобы увидеть данные профиля.</p>
        )}
      </section>

      <ThemeSelector />
      <ResetDataCard />
    </>
  );
};

export default SettingsPage;

