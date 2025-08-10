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
            <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 flex flex-col items-center justify-center p-4 font-sans overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path fill="#fff" fillOpacity="0.2" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,181.3C672,171,768,181,864,197.3C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
                </div>

                <div className="text-center mb-6 text-white z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto drop-shadow-lg"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>
                    <h1 className="text-5xl md:text-6xl font-title mt-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Salão de Beleza</h1>
                    <p className="text-md md:text-lg opacity-90 tracking-wider">Agende o seu horário</p>
                </div>

                <SalonInfo />

                <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 z-10 mt-6">
                    {isLoginView ? <LoginForm onLogin={onLogin} /> : <RegisterForm />}
                    <p className="text-center mt-6 text-sm text-gray-700">{isLoginView ? "Não tem uma conta?" : "Já tem uma conta?"}
                        <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-pink-600 hover:text-pink-800 hover:underline ml-1">{isLoginView ? "Cadastre-se" : "Faça login"}</button>
                    </p>
                </div>
            </div>
        </>
    );
}