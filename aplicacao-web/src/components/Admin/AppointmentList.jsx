// src/components/Admin/AppointmentList.jsx
import React from 'react';

export default function AppointmentList({ appointments, onCancel }) {
    return (
        <div className="space-y-3">
            {appointments.length > 0 ? appointments.map(apt => (
                <div key={apt.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold">{apt.servico_nome}</p>
                        <p className="text-sm text-gray-700">Cliente: <span className="font-medium text-pink-600">{apt.cliente_nome} {apt.cliente_sobrenome}</span></p>
                        <p className="text-sm text-gray-700">Profissional: <span className="font-medium text-purple-600">{apt.profissional_nome}</span></p>
                        <p className="text-sm text-gray-700">Telefone: <span className="font-medium">{apt.cliente_telefone || 'Não informado'}</span></p>
                        <p className="text-sm text-gray-700">Data: {new Date(apt.data_hora_inicio).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                    </div>
                    <button onClick={() => onCancel(apt.id)} className="text-xs font-semibold bg-red-200 text-red-700 px-3 py-1 rounded-full hover:bg-red-300">Cancelar</button>
                </div>
            )) : <p>Nenhum agendamento encontrado.</p>}
        </div>
    );
}