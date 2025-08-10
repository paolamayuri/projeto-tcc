// src/screens/BookingProcess.jsx
import React, { useState } from 'react';
import api from '../api';
import { BackIcon } from '../components/Icons';

// Importando os componentes de cada etapa
import ServiceSelectionStep from '../components/Booking/ServiceSelectionStep';
import ProfessionalSelectionStep from '../components/Booking/ProfessionalSelectionStep';
import TimeSelectionStep from '../components/Booking/TimeSelectionStep';
import ConfirmationStep from '../components/Booking/ConfirmationStep';
import SuccessStep from '../components/Booking/SuccessStep';

export default function BookingProcess({ user, onLogout }) {
    const [step, setStep] = useState(1);
    const [bookingDetails, setBookingDetails] = useState({ services: [], professional: null, dateTime: null, observations: '' });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const restart = () => {
        setBookingDetails({ services: [], professional: null, dateTime: null, observations: '' });
        setStep(1);
    }

    const handleSelectServices = (selectedServices) => {
        setBookingDetails(prev => ({ ...prev, services: selectedServices }));
        nextStep();
    };

    const handleSelectProfessional = (professional) => {
        setBookingDetails(prev => ({ ...prev, professional: professional }));
        nextStep();
    };

    const handleSelectDateTime = (dateTime) => {
        setBookingDetails(prev => ({ ...prev, dateTime: dateTime }));
        nextStep();
    };

    const handleConfirmBooking = async (observations) => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                id_servico: bookingDetails.services[0].id,
                id_profissional: bookingDetails.professional.id,
                data_hora_inicio: bookingDetails.dateTime,
                observacao: observations
            };
            await api.post('/appointments', payload, { headers: { Authorization: `Bearer ${token}` } });
            setStep(5);
        } catch (error) {
            console.error("Erro ao confirmar agendamento", error);
        }
    };

    const steps = [
        { num: 1, title: "Escolha os Serviços" },
        { num: 2, title: "Escolha o Profissional" },
        { num: 3, title: "Escolha o Horário" },
        { num: 4, title: "Confirmação" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <header className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
                <div className="flex items-center space-x-4">
                    {step > 1 && step < 5 && (
                        <button onClick={prevStep} className="p-2 rounded-full hover:bg-gray-200"><BackIcon /></button>
                    )}
                    <h1 className="text-xl md:text-2xl font-bold text-gray-700">{steps.find(s => s.num === step)?.title || "Agendamento"}</h1>
                </div>
                <button onClick={onLogout} className="text-sm font-medium text-red-500">Sair</button>
            </header>

            <main className="max-w-4xl mx-auto">
                {step === 1 && <ServiceSelectionStep onContinue={handleSelectServices} />}
                {step === 2 && <ProfessionalSelectionStep onContinue={handleSelectProfessional} />}
                {step === 3 && <TimeSelectionStep bookingDetails={bookingDetails} onContinue={handleSelectDateTime} />}
                {step === 4 && <ConfirmationStep bookingDetails={bookingDetails} onConfirm={handleConfirmBooking} />}
                {step === 5 && <SuccessStep onRestart={restart} />}
            </main>
        </div>
    );
}