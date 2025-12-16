import { useState, useEffect } from 'react';
import { LogoMM } from './LogoMM';

const ONBOARDING_KEY = 'moneymate_onboarding_completed';

type OnboardingProps = {
  onComplete: () => void;
};

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setShowOnboarding(true);
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
    onComplete();
  };

  if (!showOnboarding) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        overflow: 'auto'
      }}
    >
      {/* Декоративные волны */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'radial-gradient(ellipse at top, rgba(132, 98, 244, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'radial-gradient(ellipse at bottom, rgba(100, 100, 120, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        {/* Логотип */}
        <div
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, rgba(132, 98, 244, 0.12) 0%, rgba(26, 26, 46, 0.85) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(132, 98, 244, 0.25)'
          }}
        >
          <LogoMM size={120} />
        </div>

        {/* Приветствие */}
        <div style={{ color: '#cbd5f5', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
          Добро пожаловать в
        </div>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#8462F4',
            margin: '0 0 3rem 0',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          MoneyMate
        </h1>

        {/* Карточки с информацией */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          {/* Карточка 1 */}
          <div
            style={{
              background: 'rgba(27, 27, 38, 0.8)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              textAlign: 'left',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(132, 98, 244, 0.1)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(132, 98, 244, 0.2)',
                color: '#cbd5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                flexShrink: 0
              }}
            >
              1
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  color: '#f8fafc',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  margin: '0 0 0.5rem 0'
                }}
              >
                СЛЕДИТЕ ЗА СВОИМИ ДОХОДАМИ И РАСХОДАМИ
              </h3>
              <p
                style={{
                  color: '#cbd5f5',
                  fontSize: '0.85rem',
                  margin: 0,
                  lineHeight: '1.5'
                }}
              >
                Фиксируйте свои расходы и доходы, чтобы всегда знать на что тратятся деньги, и
                откуда они появляются!
              </p>
            </div>
          </div>

          {/* Карточка 2 */}
          <div
            style={{
              background: 'rgba(27, 27, 38, 0.8)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              textAlign: 'left',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(132, 98, 244, 0.1)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(132, 98, 244, 0.2)',
                color: '#cbd5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                flexShrink: 0
              }}
            >
              2
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  color: '#f8fafc',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  margin: '0 0 0.5rem 0'
                }}
              >
                ПЛАНИРУЙТЕ СВОИ ПОКУПКИ
              </h3>
              <p
                style={{
                  color: '#cbd5f5',
                  fontSize: '0.85rem',
                  margin: 0,
                  lineHeight: '1.5'
                }}
              >
                Составляйте список того, что хотите приобрести в ближайшее время!
              </p>
            </div>
          </div>
        </div>

        {/* Кнопка */}
        <button
          onClick={handleStart}
          style={{
            width: '100%',
            background: '#ac99eb',
            color: '#f8fafc',
            padding: '1rem',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          НАЧАЛО РАБОТЫ
        </button>
      </div>
    </div>
  );
};

