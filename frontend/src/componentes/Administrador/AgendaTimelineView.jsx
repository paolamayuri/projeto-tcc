// src/components/Admin/AgendaTimelineView.jsx
import React, { useState } from 'react';
import DayTimeline from './DayTimeline';

export default function AgendaTimelineView({ appointments }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const goToPreviousWeek = () => {
        setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)));
    };

    const goToNextWeek = () => {
        setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)));
    };

    const getWeekDays = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });
    };

    const weekDays = getWeekDays(currentDate);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={goToPreviousWeek} className="px-4 py-2 bg-gray-200 rounded-lg">Anterior</button>
                <h3 className="text-xl font-bold text-center">
                    Semana de {weekDays[0].toLocaleDateString('pt-BR')} à {weekDays[6].toLocaleDateString('pt-BR')}
                </h3>
                <button onClick={goToNextWeek} className="px-4 py-2 bg-gray-200 rounded-lg">Próxima</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                {weekDays.map(day => {
                    const dailyAppointments = appointments.filter(a => new Date(a.data_hora_inicio).toDateString() === day.toDateString());
                    return <DayTimeline key={day.toISOString()} date={day} appointments={dailyAppointments} />;
                })}
            </div>
        </div>
    );
};