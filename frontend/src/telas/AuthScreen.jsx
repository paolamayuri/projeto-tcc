// src/screens/AuthScreen.jsx
import React, { useState } from 'react';
import SalonInfo from '../componentes/Autenticacao/SalonInfo';
import LoginForm from '../componentes/Autenticacao/LoginForm';
import RegisterForm from '../componentes/Autenticacao/RegisterForm';

export default function AuthScreen({ onLogin }) {
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
                {/* Lado esquerdo com imagem e informações */}
                <div className="relative hidden md:block">
                    <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop" alt="Salão" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 p-5 flex items-end">
                        <SalonInfo />
                    </div>
                </div>
                {/* Lado direito com card de login/cadastro */}
                <div className="bg-white p-6 md:p-8">
                    {!showRegister ? (
                        <LoginForm onLogin={onLogin} onSwitchToRegister={() => setShowRegister(true)} />
                    ) : (
                        <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
                    )}
                </div>
            </div>
        </div>
    );
}