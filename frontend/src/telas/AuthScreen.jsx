// src/screens/AuthScreen.jsx
import React, { useState } from 'react';
import SalonInfo from '../componentes/Autenticacao/SalonInfo';
import LoginForm from '../componentes/Autenticacao/LoginForm';
import RegisterForm from '../componentes/Autenticacao/RegisterForm';

export default function AuthScreen({ onLogin }) {
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <SalonInfo />
                {!showRegister ? (
                    <LoginForm onSwitchToRegister={() => setShowRegister(true)} onLogin={onLogin} />
                ) : (
                    <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
                )}
            </div>
        </div>
    );
}