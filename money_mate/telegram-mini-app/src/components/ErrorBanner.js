import { jsx as _jsx } from "react/jsx-runtime";
export const ErrorBanner = ({ message }) => {
    if (!message)
        return null;
    return (_jsx("div", { style: {
            background: 'rgba(244,63,94,0.15)',
            color: '#f43f5e',
            padding: '0.85rem 1rem',
            borderRadius: '16px',
            marginBottom: '1rem',
            fontSize: '0.95rem'
        }, children: message }));
};
