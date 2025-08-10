// src/components/Admin/ServiceManager.jsx
import React from 'react';

export default function ServiceManager({ services, onEdit, onDelete }) {
    return (
        <div className="space-y-3">
            {services.map(service => (
                <div key={service.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold">{service.nome}</p>
                        <p className="text-sm text-gray-600">Duração: {service.duracao} minutos</p>
                        <p className="text-sm text-gray-600">Preço: R$ {service.preco !== undefined && service.preco !== null ? service.preco.toFixed(2) : '0.00'}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => onEdit(service)} className="text-xs font-semibold bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-300">Editar</button>
                        <button onClick={() => onDelete(service.id)} className="text-xs font-semibold bg-red-200 text-red-700 px-3 py-1 rounded-full hover:bg-red-300">Excluir</button>
                    </div>
                </div>
            ))}
        </div>
    );
}