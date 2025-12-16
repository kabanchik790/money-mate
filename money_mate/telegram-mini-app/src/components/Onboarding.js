import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { LogoMM } from './LogoMM';
const ONBOARDING_KEY = 'moneymate_onboarding_completed';
export const Onboarding = ({ onComplete }) => {
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
    if (!showOnboarding)
        return null;
    return (_jsxs("div", { style: {
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
        }, children: [_jsx("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '200px',
                    background: 'radial-gradient(ellipse at top, rgba(132, 98, 244, 0.15) 0%, transparent 70%)',
                    pointerEvents: 'none'
                } }), _jsx("div", { style: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '200px',
                    background: 'radial-gradient(ellipse at bottom, rgba(100, 100, 120, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none'
                } }), _jsxs("div", { style: { position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '400px', width: '100%' }, children: [_jsx("div", { style: {
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
                        }, children: _jsx(LogoMM, { size: 120 }) }), _jsx("div", { style: { color: '#cbd5f5', fontSize: '0.95rem', marginBottom: '0.5rem' }, children: "\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C \u0432" }), _jsx("h1", { style: {
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#8462F4',
                            margin: '0 0 3rem 0',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }, children: "MoneyMate" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }, children: [_jsxs("div", { style: {
                                    background: 'rgba(27, 27, 38, 0.8)',
                                    borderRadius: '16px',
                                    padding: '1.25rem',
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(132, 98, 244, 0.1)'
                                }, children: [_jsx("div", { style: {
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
                                        }, children: "1" }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("h3", { style: {
                                                    color: '#f8fafc',
                                                    fontSize: '0.95rem',
                                                    fontWeight: 'bold',
                                                    margin: '0 0 0.5rem 0'
                                                }, children: "\u0421\u041B\u0415\u0414\u0418\u0422\u0415 \u0417\u0410 \u0421\u0412\u041E\u0418\u041C\u0418 \u0414\u041E\u0425\u041E\u0414\u0410\u041C\u0418 \u0418 \u0420\u0410\u0421\u0425\u041E\u0414\u0410\u041C\u0418" }), _jsx("p", { style: {
                                                    color: '#cbd5f5',
                                                    fontSize: '0.85rem',
                                                    margin: 0,
                                                    lineHeight: '1.5'
                                                }, children: "\u0424\u0438\u043A\u0441\u0438\u0440\u0443\u0439\u0442\u0435 \u0441\u0432\u043E\u0438 \u0440\u0430\u0441\u0445\u043E\u0434\u044B \u0438 \u0434\u043E\u0445\u043E\u0434\u044B, \u0447\u0442\u043E\u0431\u044B \u0432\u0441\u0435\u0433\u0434\u0430 \u0437\u043D\u0430\u0442\u044C \u043D\u0430 \u0447\u0442\u043E \u0442\u0440\u0430\u0442\u044F\u0442\u0441\u044F \u0434\u0435\u043D\u044C\u0433\u0438, \u0438 \u043E\u0442\u043A\u0443\u0434\u0430 \u043E\u043D\u0438 \u043F\u043E\u044F\u0432\u043B\u044F\u044E\u0442\u0441\u044F!" })] })] }), _jsxs("div", { style: {
                                    background: 'rgba(27, 27, 38, 0.8)',
                                    borderRadius: '16px',
                                    padding: '1.25rem',
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(132, 98, 244, 0.1)'
                                }, children: [_jsx("div", { style: {
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
                                        }, children: "2" }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("h3", { style: {
                                                    color: '#f8fafc',
                                                    fontSize: '0.95rem',
                                                    fontWeight: 'bold',
                                                    margin: '0 0 0.5rem 0'
                                                }, children: "\u041F\u041B\u0410\u041D\u0418\u0420\u0423\u0419\u0422\u0415 \u0421\u0412\u041E\u0418 \u041F\u041E\u041A\u0423\u041F\u041A\u0418" }), _jsx("p", { style: {
                                                    color: '#cbd5f5',
                                                    fontSize: '0.85rem',
                                                    margin: 0,
                                                    lineHeight: '1.5'
                                                }, children: "\u0421\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0439\u0442\u0435 \u0441\u043F\u0438\u0441\u043E\u043A \u0442\u043E\u0433\u043E, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u043F\u0440\u0438\u043E\u0431\u0440\u0435\u0441\u0442\u0438 \u0432 \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F!" })] })] })] }), _jsx("button", { onClick: handleStart, style: {
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
                        }, onMouseEnter: (e) => {
                            e.currentTarget.style.opacity = '0.9';
                        }, onMouseLeave: (e) => {
                            e.currentTarget.style.opacity = '1';
                        }, children: "\u041D\u0410\u0427\u0410\u041B\u041E \u0420\u0410\u0411\u041E\u0422\u042B" })] })] }));
};
