// src/components/Auth/RegisterForm.jsx
import React, { useState } from 'react';
import api from '../../api';
import { formatPhoneBr, isValidPhoneBr } from '../../utils/phone';

export default function RegisterForm() {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (telefone && !isValidPhoneBr(telefone)) {
            setError('Telefone inválido. Use um número válido com DDD.');
            return;
        }
        try {
            await api.post('/register', { nome, sobrenome, email, telefone: telefone.replace(/\D/g, ''), senha: password });
            setMessage('Cadastro realizado com sucesso! Já pode fazer o login.');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao cadastrar. Tente outro email.');
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Criar Conta</h2>
            {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">{message}</p>}
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><label className="block text-sm font-medium">Nome</label><input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white/70" required /></div>
                    <div><label className="block text-sm font-medium">Sobrenome</label><input type="text" value={sobrenome} onChange={e => setSobrenome(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white/70" /></div>
                </div>
                <div><label className="block text-sm font-medium">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white/70" required /></div>
                <div><label className="block text-sm font-medium">Telefone</label><input type="tel" value={telefone} onChange={e => setTelefone(formatPhoneBr(e.target.value))} className="w-full px-4 py-2 border rounded-lg bg-white/70" placeholder="(XX) 9XXXX-XXXX" maxLength={16} /></div>
                <div><label className="block text-sm font-medium">Senha</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white/70" required /></div>
                <button type="submit" className="w-full bg-purple-500 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-600 transition-transform transform hover:scale-105">Cadastrar</button>
            </form>
        </div>
    );
}