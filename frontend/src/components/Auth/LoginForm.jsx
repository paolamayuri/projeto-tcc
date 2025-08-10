// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import api from '../../api';

export default function LoginForm({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/login', { email, password });
            onLogin(response.data.user, response.data.token);
        } catch (err) {
            console.error("Erro detalhado no login:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Não foi possível conectar ao servidor.');
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Entrar no Salão</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center" role="alert">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                    <input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white/70" required />
                </div>
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Senha</label>
                    <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white/70" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-7 flex items-center px-3 text-gray-600 text-xs">{showPassword ? 'Ocultar' : 'Mostrar'}</button>
                </div>
                <button type="submit" className="w-full bg-pink-500 text-white py-2.5 rounded-lg font-semibold hover:bg-pink-600 transition-transform transform hover:scale-105">Entrar</button>
            </form>
        </div>
    );
}