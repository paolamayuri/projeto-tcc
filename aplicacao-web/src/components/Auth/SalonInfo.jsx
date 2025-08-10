// src/components/Auth/SalonInfo.jsx
import React, { useState } from 'react';
import { ClockIcon, LocationIcon, ChevronDownIcon } from '../Icons';

export default function SalonInfo() {
    const [hoursOpen, setHoursOpen] = useState(false);
    const operatingHours = [
        { day: 'Terça a Quinta', hours: '09:00 - 19:00' },
        { day: 'Sexta-Feira', hours: '09:00 - 20:00' },
        { day: 'Sábado', hours: '08:00 - 17:00' },
        { day: 'Domingo e Segunda', hours: 'Fechado' },
    ];
    const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });

    return (
        <div className="w-full max-w-md text-white z-10 space-y-2 text-sm">
            <div className="flex items-center justify-center bg-black/20 p-2 rounded-lg">
                <LocationIcon />
                <span>Av. Brasil, 1234 - Cianorte, PR</span>
            </div>
            <div className="bg-black/20 p-2 rounded-lg cursor-pointer" onClick={() => setHoursOpen(!hoursOpen)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ClockIcon />
                        <span>Horários de Funcionamento (Hoje: {today})</span>
                    </div>
                    <ChevronDownIcon open={hoursOpen} />
                </div>
                {hoursOpen && (
                    <ul className="mt-2 pl-8 space-y-1">
                        {operatingHours.map(item => (
                            <li key={item.day} className="flex justify-between">
                                <span>{item.day}:</span>
                                <span className="font-semibold">{item.hours}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}