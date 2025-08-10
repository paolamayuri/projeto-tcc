// src/screens/AuthScreen.jsx
import React, { useState } from 'react';
import SalonInfo from '../components/Auth/SalonInfo';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

export default function AuthScreen({ onLogin }) {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'); .font-title { font-family: 'Great Vibes', cursive; }`}</style>
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans overflow-hidden relative">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop" alt="Salão" className="w-full h-full object-cover opacity-40" />
                </div>

                <div className="relative text-center mb-4 text-white z-10">
                    <div className="mx-auto mb-2">
                        <img src="https://placehold.co/80x80/ffffff/000000?text=LOGO" alt="Logo do Salão" className="w-16 h-16 rounded-full shadow-lg mx-auto" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-title mt-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Salão Bela Vida</h1>
                    <p className="text-md md:text-lg opacity-95 tracking-wider">Beleza e cuidado em cada detalhe</p>
                </div>

                <SalonInfo />

                <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 z-10 mt-4">
                    {isLoginView ? <LoginForm onLogin={onLogin} /> : <RegisterForm />}
                    <p className="text-center mt-6 text-sm text-gray-700">{isLoginView ? "Não tem uma conta?" : "Já tem uma conta?"}
                        <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-pink-600 hover:text-pink-800 hover:underline ml-1">{isLoginView ? "Cadastre-se" : "Faça login"}</button>
                    </p>
                </div>
            </div>
        </>
    );
}