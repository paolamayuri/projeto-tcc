// src/components/Admin/ProfessionalManager.jsx
import React from 'react';

export default function ProfessionalManager({ professionals, onEdit, onDelete }) {
    return (
        <div className="space-y-3">
            {professionals.length > 0 ? professionals.map(professional => (
                <div key={professional.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <img src={professional.foto || `https://placehold.co/150x150/cccccc/ffffff?text=${professional.nome.charAt(0)}`}
                            alt={professional.nome}
                            className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex flex-col">
                            <p className="font-bold text-lg">{professional.nome}</p>

                            {/* --- LINHA CORRIGIDA --- */}
                            {/* Agora verificamos se 'servicos_oferecidos' existe ANTES de tentar ler o '.length' */}
                            {professional.servicos_oferecidos && professional.servicos_oferecidos.length > 0 && (
                                <p className="text-sm text-gray-600">
                                    Atende: {professional.servicos_oferecidos.map(s => s.nome).join(', ')}
                                </p>
                            )}
                            
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => onEdit(professional)} className="text-xs font-semibold bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-300">Editar</button>
                        <button onClick={() => onDelete(professional.id)} className="text-xs font-semibold bg-red-200 text-red-700 px-3 py-1 rounded-full hover:bg-red-300">Excluir</button>
                    </div>
                </div>
            )) : <p>Nenhum profissional encontrado.</p>}
        </div>
    );
}