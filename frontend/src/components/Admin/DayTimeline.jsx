// src/components/Admin/DayTimeline.jsx
import React from 'react';

export default function DayTimeline({ date, appointments }) {
    const startHour = 8;
    const endHour = 20;
    const totalHours = endHour - startHour;
    const PIXELS_PER_MINUTE = 1.5;

    const hours = Array.from({ length: totalHours }, (_, i) => i + startHour);

    const getPositionAndHeight = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const startOfDay = new Date(startDate);
        startOfDay.setHours(startHour, 0, 0, 0);
        const top = (startDate - startOfDay) / (1000 * 60) * PIXELS_PER_MINUTE;
        const height = (endDate - startDate) / (1000 * 60) * PIXELS_PER_MINUTE;
        return { top, height: Math.max(height, 20) };
    }

    // --- INÍCIO DA NOVA LÓGICA DE AGRUPAMENTO ---
    const groupedAppointments = appointments.reduce((acc, apt) => {
        const { top, height } = getPositionAndHeight(apt.data_hora_inicio, apt.data_hora_fim);
        
        // A chave do grupo será a posição 'top'. Agendamentos no mesmo horário terão o mesmo 'top'.
        const key = top;

        if (!acc[key]) {
            acc[key] = {
                appointments: [],
                top: top,
                // Usamos a maior altura do grupo para o contêiner
                height: 0, 
            };
        }

        acc[key].appointments.push(apt);
        
        // Garante que o contêiner do grupo tenha a altura do maior agendamento
        if (height > acc[key].height) {
            acc[key].height = height;
        }

        return acc;
    }, {});
    // --- FIM DA NOVA LÓGICA DE AGRUPAMENTO ---

    const title = date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit' });
    const isClosedDay = date.getDay() === 0 || date.getDay() === 1;

    return (
        <div>
            <h3 className={`text-lg font-bold mb-2 text-center ${isClosedDay ? 'text-red-500' : ''}`}>{title}</h3>
            <div className="bg-gray-50 rounded-lg p-2 relative" style={{ height: (totalHours * 60 * PIXELS_PER_MINUTE) + 'px' }}>
                {hours.map(hour => (
                    <div key={hour} className="relative border-t border-gray-200" style={{ height: `${60 * PIXELS_PER_MINUTE}px` }}>
                        <span className="absolute -top-3 left-0 bg-gray-50 px-1 text-xs text-gray-500">{`${String(hour).padStart(2, '0')}:00`}</span>
                    </div>
                ))}
                {isClosedDay && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
                        <p className="font-semibold text-gray-500">Fechado</p>
                    </div>
                )}
                
                {/* --- INÍCIO DA RENDERIZAÇÃO ALTERADA --- */}
                {/* Agora, mapeamos os GRUPOS, não mais os agendamentos diretamente */}
                {Object.values(groupedAppointments).map((group, index) => (
                    // 1. O Contêiner do Grupo: Posicionado de forma absoluta, com Flexbox
                    <div
                        key={index}
                        className="absolute left-12 right-0 flex gap-1" // Adicionado "flex" e "gap-1"
                        style={{
                            top: `${group.top}px`,
                            height: `${group.height}px`,
                        }}
                    >
                        {/* 2. Mapeamos os agendamentos DENTRO do grupo */}
                        {group.appointments.map(apt => (
                            // 3. O Card do Agendamento: Agora é um item flexível, sem posicionamento
                            <div 
                                key={apt.id}
                                className="flex-1 min-w-0 bg-pink-200 border-l-4 border-pink-500 p-2 rounded-lg overflow-hidden"
                            >
                                <p className="font-bold text-sm text-pink-800 truncate">{apt.servico_nome}</p>
                                <p className="text-xs text-pink-700">{apt.cliente_nome} {apt.cliente_sobrenome}</p>
                                <p className="text-xs text-pink-700">Com: {apt.profissional_nome}</p>
                            </div>
                        ))}
                    </div>
                ))}
                {/* --- FIM DA RENDERIZAÇÃO ALTERADA --- */}
            </div>
        </div>
    );
};