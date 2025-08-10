// src/components/Booking/TimeSelectionStep.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function TimeSelectionStep({ bookingDetails, onContinue }) {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        if (selectedDate && bookingDetails.services.length > 0 && bookingDetails.professional) {
            const serviceId = bookingDetails.services[0].id;
            const professionalId = bookingDetails.professional.id;
            const day = new Date(`${selectedDate}T12:00:00`).getDay();
            if (day === 0 || day === 1) {
                setAvailableSlots([]);
                return;
            }
            api.get(`/availability?date=${selectedDate}&serviceId=${serviceId}&professionalId=${professionalId}`)
                .then(res => setAvailableSlots(res.data))
                .catch(error => {
                    console.error("Erro ao buscar horários disponíveis:", error);
                    setAvailableSlots([]);
                });
        }
    }, [selectedDate, bookingDetails.services, bookingDetails.professional]);

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <input type="date" value={selectedDate} min={minDate} onChange={e => setSelectedDate(e.target.value)} className="w-full p-2 border rounded-lg mb-6" />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {availableSlots.length > 0 ? availableSlots.map(slot => {
                    const time = new Date(slot).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const isSelected = selectedTime === slot;
                    return (
                        <button key={slot} onClick={() => setSelectedTime(slot)}
                            className={`p-3 rounded-lg text-sm ${isSelected ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>
                            {time}
                        </button>
                    )
                }) : <p className="col-span-full text-gray-500">Nenhum horário disponível para esta data, serviço e profissional.</p>}
            </div>
            <div className="mt-8 text-center">
                <button onClick={() => onContinue(selectedTime)} disabled={!selectedTime}
                    className="bg-pink-500 text-white px-10 py-3 rounded-full font-semibold disabled:bg-gray-300">
                    Continuar
                </button>
            </div>
        </div>
    );
}