type ErrorBannerProps = {
  message?: string;
};

export const ErrorBanner = ({ message }: ErrorBannerProps) => {
  if (!message) return null;
  return (
    <div
      style={{
        background: 'rgba(244,63,94,0.15)',
        color: '#f43f5e',
        padding: '0.85rem 1rem',
        borderRadius: '16px',
        marginBottom: '1rem',
        fontSize: '0.95rem'
      }}
    >
      {message}
    </div>
  );
};

