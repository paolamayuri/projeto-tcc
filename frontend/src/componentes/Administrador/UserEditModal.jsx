// src/components/Admin/UserEditModal.jsx
import React, { useState } from 'react';
import api from '../../api';
import { formatPhoneBr, isValidPhoneBr } from '../../utilitarios/phone';

export default function UserEditModal({ userToEdit, onClose, onSave }) {
    const [nome, setNome] = useState(userToEdit.nome);
    const [sobrenome, setSobrenome] = useState(userToEdit.sobrenome || '');
    const [telefone, setTelefone] = useState(userToEdit.telefone || '');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (telefone && !isValidPhoneBr(telefone)) {
            setError('Telefone inválido.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const payload = { nome, sobrenome, telefone: telefone.replace(/\D/g, '') };
            await api.put(`/users/${userToEdit.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            onSave();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao atualizar dados.');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b"><h3 className="text-xl font-bold">Editar Perfil do Cliente</h3></div>
                    <div className="p-6 space-y-4">
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium">Nome</label><input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required /></div>
                            <div><label className="block text-sm font-medium">Sobrenome</label><input type="text" value={sobrenome} onChange={e => setSobrenome(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                        </div>
                        <div><label className="block text-sm font-medium">Telefone</label><input type="tel" value={telefone} onChange={e => setTelefone(formatPhoneBr(e.target.value))} className="w-full px-4 py-2 border rounded-lg" maxLength={16} /></div>
                        <div><label className="block text-sm font-medium text-gray-500">Email (não pode ser alterado)</label><input type="email" value={userToEdit.email} className="w-full px-4 py-2 border rounded-lg bg-gray-100" disabled /></div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    );
}