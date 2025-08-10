// src/components/Admin/DayTimeline.jsx
import React, { useMemo } from 'react';

export default function DayTimeline({ date, appointments }) {
    const startHour = 8;
    const endHour = 20;
    const totalHours = endHour - startHour;
    const PIXELS_PER_MINUTE = 1.4;

    const hours = useMemo(() => Array.from({ length: totalHours }, (_, i) => i + startHour), [totalHours]);

    const getPositionAndHeight = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const startOfDay = new Date(startDate);
        startOfDay.setHours(startHour, 0, 0, 0);
        const top = (startDate - startOfDay) / (1000 * 60) * PIXELS_PER_MINUTE;
        const height = (endDate - startDate) / (1000 * 60) * PIXELS_PER_MINUTE;
        return { top, height: Math.max(height, 22) };
    };

    const professionals = useMemo(() => {
        const set = new Map();
        for (const apt of appointments) {
            if (!set.has(apt.profissional_nome)) set.set(apt.profissional_nome, { name: apt.profissional_nome, photo: apt.profissional_foto });
        }
        return Array.from(set.values());
    }, [appointments]);

    const appointmentsByProfessional = useMemo(() => {
        const map = new Map();
        for (const prof of professionals) map.set(prof.name, []);
        for (const apt of appointments) {
            const list = map.get(apt.profissional_nome) || [];
            list.push(apt);
            map.set(apt.profissional_nome, list);
        }
        return map;
    }, [appointments, professionals]);

    const title = date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit' });
    const isClosedDay = date.getDay() === 0 || date.getDay() === 1;
    const timelineHeightPx = `${totalHours * 60 * PIXELS_PER_MINUTE}px`;

    return (
        <div>
            <h3 className={`text-lg font-bold mb-2 text-center ${isClosedDay ? 'text-red-500' : ''}`}>{title}</h3>

            {/* Cabeçalho das colunas (profissionais) */}
            <div
                className="grid gap-2 items-center mb-2"
                style={{ gridTemplateColumns: `64px repeat(${Math.max(professionals.length, 1)}, minmax(0, 1fr))` }}
            >
                <div />
                {professionals.length > 0 ? professionals.map((prof) => (
                    <div key={prof.name} className="flex items-center justify-center gap-2 py-1 bg-white rounded border">
                        {prof.photo && <img src={prof.photo} alt={prof.name} className="w-6 h-6 rounded-full object-cover" />}
                        <span className="text-xs font-semibold text-gray-700 truncate">{prof.name}</span>
                    </div>
                )) : (
                    <div className="text-center text-sm text-gray-500 col-span-1">Sem profissionais/agendamentos</div>
                )}
            </div>

            {/* Corpo da linha do tempo: trilho de horários + colunas por profissional */}
            <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `64px repeat(${Math.max(professionals.length, 1)}, minmax(0, 1fr))` }}
            >
                {/* Trilho de horários à esquerda */}
                <div className="relative bg-gray-50 rounded-lg" style={{ height: timelineHeightPx }}>
                    {hours.map((hour) => (
                        <div key={hour} className="relative border-t border-gray-200" style={{ height: `${60 * PIXELS_PER_MINUTE}px` }}>
                            <span className="absolute -top-3 left-0 bg-gray-50 px-1 text-xs text-gray-500">{`${String(hour).padStart(2, '0')}:00`}</span>
                        </div>
                    ))}
                </div>

                {/* Uma coluna por profissional */}
                {professionals.length > 0 ? professionals.map((prof) => (
                    <div key={prof.name} className="relative bg-white rounded-lg border" style={{ height: timelineHeightPx }}>
                        {/* Linhas de hora (sem rótulo) */}
                        {hours.map((hour) => (
                            <div key={hour} className="border-t border-gray-100" style={{ height: `${60 * PIXELS_PER_MINUTE}px` }} />
                        ))}

                        {/* Overlay de "Fechado" */}
                        {isClosedDay && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-60 rounded-lg">
                                <p className="font-semibold text-gray-600 text-sm">Fechado</p>
                            </div>
                        )}

                        {/* Agendamentos deste profissional */}
                        {!isClosedDay && (appointmentsByProfessional.get(prof.name) || []).map((apt) => {
                            const { top, height } = getPositionAndHeight(apt.data_hora_inicio, apt.data_hora_fim);
                            const startTime = new Date(apt.data_hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                            const endTime = new Date(apt.data_hora_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                            return (
                                <div
                                    key={apt.id}
                                    className="absolute left-1 right-1 bg-pink-100 border-l-4 border-pink-500 p-2 rounded shadow-sm overflow-hidden"
                                    style={{ top: `${top}px`, height: `${height}px` }}
                                    title={`${apt.servico_nome} | ${startTime} - ${endTime} | ${apt.cliente_nome} ${apt.cliente_sobrenome || ''}`}
                                >
                                    <p className="font-semibold text-pink-800 text-xs truncate">{apt.servico_nome}</p>
                                    <p className="text-[10px] text-pink-700">{startTime} - {endTime}</p>
                                    <p className="text-[10px] text-pink-700 truncate">{apt.cliente_nome} {apt.cliente_sobrenome}</p>
                                </div>
                            );
                        })}
                    </div>
                )) : (
                    <div className="relative bg-white rounded-lg border flex items-center justify-center text-sm text-gray-500" style={{ height: timelineHeightPx }}>
                        Nenhum agendamento neste dia
                    </div>
                )}
            </div>
        </div>
    );
}