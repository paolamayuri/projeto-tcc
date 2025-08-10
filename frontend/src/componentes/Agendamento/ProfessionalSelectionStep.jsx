// src/components/Booking/ProfessionalSelectionStep.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function ProfessionalSelectionStep({ onContinue, selectedServiceId }) {
    const [professionals, setProfessionals] = useState([]);
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        api.get('/professionals')
            .then(res => setProfessionals(res.data))
            .catch(error => console.error("Erro ao buscar profissionais:", error));
    }, []);

    useEffect(() => {
        if (!selectedServiceId) {
            setFiltered(professionals);
        } else {
            setFiltered(
                professionals.filter(p => (p.servicos_oferecidos || []).some(s => s.id === selectedServiceId))
            );
        }
    }, [professionals, selectedServiceId]);

    return (
        <div>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <ul className="divide-y divide-gray-200">
                    {filtered.map(pro => (
                        <li key={pro.id} onClick={() => onContinue(pro)} className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50">
                            <img src={pro.foto || `https://placehold.co/150x150/cccccc/ffffff?text=${pro.nome.charAt(0)}`} alt={pro.nome} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg">{pro.nome}</span>
                                {pro.servicos_oferecidos && pro.servicos_oferecidos.length > 0 && (
                                    <p className="text-sm text-gray-500">
                                        Atende: {pro.servicos_oferecidos.map(s => s.nome).join(', ')}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                    {filtered.length === 0 && (
                        <li className="p-4 text-gray-500">Nenhum profissional atende este serviço.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}