// src/components/Admin/ClientList.jsx
import React from 'react';

export default function ClientList({ clients, onEdit }) {
    return (
        <div className="space-y-3">
            {clients.length > 0 ? clients.map(client => (
                <div key={client.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold">{client.nome} {client.sobrenome}</p>
                        <p className="text-sm text-gray-600">Email: {client.email}</p>
                        <p className="text-sm text-gray-600">Telefone: {client.telefone || 'Não informado'}</p>
                    </div>
                    <button onClick={() => onEdit(client)} className="text-xs font-semibold bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-300">Editar</button>
                </div>
            )) : <p>Nenhum cliente encontrado.</p>}
        </div>
    );
}