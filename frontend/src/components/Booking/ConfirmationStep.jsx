// src/components/Booking/ConfirmationStep.jsx
import React, { useState } from 'react';

export default function ConfirmationStep({ bookingDetails, onConfirm }) {
    const [observations, setObservations] = useState('');
    const { services, professional, dateTime } = bookingDetails;
    const service = services[0];

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4 border-b pb-3">Resumo do Agendamento</h2>
            <div className="space-y-4 text-gray-700">
                <p><strong>Serviço:</strong> {service.nome} ({service.duracao} min)</p>
                <p><strong>Profissional:</strong> {professional.nome}</p>
                <p><strong>Data e Hora:</strong> {new Date(dateTime).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                <div>
                    <label htmlFor="obs" className="block font-semibold mb-2">Algum pedido especial?</label>
                    <textarea id="obs" value={observations} onChange={e => setObservations(e.target.value)}
                        className="w-full p-2 border rounded-lg" rows="3"
                        placeholder="Ex: alergia a algum produto, preferência de esmalte, etc."></textarea>
                </div>
                <button onClick={() => onConfirm(observations)} className="w-full bg-green-500 text-white px-10 py-3 rounded-full font-semibold hover:bg-green-600">
                    Confirmar Agendamento
                </button>
            </div>
        </div>
    );
}