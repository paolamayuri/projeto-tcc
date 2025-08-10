// src/screens/BookingProcess.jsx
import React, { useState } from 'react';
import api from '../api';
import { BackIcon } from '../componentes/Icons';

// Importando os componentes de cada etapa
import ServiceSelectionStep from '../componentes/Agendamento/ServiceSelectionStep';
import ProfessionalSelectionStep from '../componentes/Agendamento/ProfessionalSelectionStep';
import TimeSelectionStep from '../componentes/Agendamento/TimeSelectionStep';
import ConfirmationStep from '../componentes/Agendamento/ConfirmationStep';
import SuccessStep from '../componentes/Agendamento/SuccessStep';

export default function BookingProcess({ user, onLogout }) {
    const [bookingDetails, setBookingDetails] = useState({ services: [], professional: null, time: null });
    const [step, setStep] = useState(1);

    const handleContinueToConfirmation = async (selectedTime) => {
        setBookingDetails(prev => ({ ...prev, time: selectedTime }));
        setStep(4);
    };

    const handleConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                id_servico: bookingDetails.services[0].id,
                id_profissional: bookingDetails.professional.id,
                data_hora_inicio: bookingDetails.time
            };
            await api.post('/appointments', payload, { headers: { Authorization: `Bearer ${token}` } });
            setStep(5);
        } catch (error) {
            console.error('Erro ao confirmar agendamento:', error);
            alert(error.response?.data?.message || 'Erro ao confirmar agendamento.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="p-4 flex items-center justify-between bg-white border-b">
                <button className="flex items-center gap-2 text-gray-700" onClick={() => setStep(prev => Math.max(1, prev - 1))}><BackIcon />Voltar</button>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{user?.nome}</span>
                    <button onClick={onLogout} className="text-sm text-red-500">Sair</button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-4">
                {step === 1 && <ServiceSelectionStep onContinue={(services) => { setBookingDetails(prev => ({ ...prev, services })); setStep(2); }} />}
                {step === 2 && <ProfessionalSelectionStep selectedService={bookingDetails.services[0]} onContinue={(prof) => { setBookingDetails(prev => ({ ...prev, professional: prof })); setStep(3); }} />}
                {step === 3 && <TimeSelectionStep bookingDetails={bookingDetails} onContinue={handleContinueToConfirmation} />}
                {step === 4 && <ConfirmationStep bookingDetails={bookingDetails} onConfirm={handleConfirm} />}
                {step === 5 && <SuccessStep />}
            </main>
        </div>
    );
}