// src/components/Admin/AppointmentList.jsx
import React from 'react';

export default function AppointmentList({ appointments, onCancel }) {
    if (!appointments || appointments.length === 0) {
        return <p className="text-center text-gray-500">Nenhum agendamento encontrado.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {appointments.map((apt) => {
                const start = new Date(apt.data_hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const end = new Date(apt.data_hora_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const date = new Date(apt.data_hora_inicio).toLocaleDateString('pt-BR');
                return (
                    <div key={apt.id} className="bg-white rounded-lg border p-3">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-pink-800 text-sm truncate">{apt.servico_nome}</h4>
                            <button className="text-xs text-red-600" onClick={() => onCancel(apt.id)}>Cancelar</button>
                        </div>
                        <p className="text-xs text-gray-600">{date} • {start} - {end}</p>
                        <p className="text-xs text-gray-700">Cliente: {apt.cliente_nome} {apt.cliente_sobrenome}</p>
                        <p className="text-xs text-gray-700">Profissional: {apt.profissional_nome}</p>
                    </div>
                );
            })}
        </div>
    );
}