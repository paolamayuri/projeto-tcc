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
        return { top, height: Math.max(height, 22) };
    };

    function overlaps(a, b) {
        return new Date(a.data_hora_inicio) < new Date(b.data_hora_fim) && new Date(b.data_hora_inicio) < new Date(a.data_hora_fim);
    }

    // Constrói grupos de conflito (componentes conexos) e atribui colunas por grupo
    function layoutAppointments(apts) {
        const items = apts.map(a => ({ ...a, ...getPositionAndHeight(a.data_hora_inicio, a.data_hora_fim) }));
        // Passo 1: criar grupos de conflitos (O(n^2) aceitável para poucos itens)
        const visited = new Set();
        const groups = [];
        for (let i = 0; i < items.length; i++) {
            if (visited.has(i)) continue;
            const stack = [i];
            const groupIdxs = new Set();
            visited.add(i);
            groupIdxs.add(i);
            while (stack.length) {
                const u = stack.pop();
                for (let v = 0; v < items.length; v++) {
                    if (!visited.has(v) && overlaps(items[u], items[v])) {
                        visited.add(v);
                        groupIdxs.add(v);
                        stack.push(v);
                    }
                }
            }
            groups.push(Array.from(groupIdxs).sort((a, b) => new Date(items[a].data_hora_inicio) - new Date(items[b].data_hora_inicio)));
        }
        // Passo 2: para cada grupo, aplicar coloração gulosa por colunas
        const laidOut = [];
        groups.forEach(indexes => {
            const columnsEnd = []; // end time de cada coluna
            const columnFor = new Map();
            indexes.forEach(idx => {
                const it = items[idx];
                // encontra primeira coluna livre
                let assigned = -1;
                for (let c = 0; c < columnsEnd.length; c++) {
                    if (new Date(columnsEnd[c]) <= new Date(it.data_hora_inicio)) {
                        assigned = c;
                        break;
                    }
                }
                if (assigned === -1) {
                    assigned = columnsEnd.length;
                    columnsEnd.push(it.data_hora_fim);
                } else {
                    columnsEnd[assigned] = it.data_hora_fim;
                }
                columnFor.set(idx, assigned);
            });
            const totalColumns = columnsEnd.length;
            indexes.forEach(idx => {
                const it = items[idx];
                const col = columnFor.get(idx);
                const gutter = 8; // px entre colunas
                const widthPercent = 100 / totalColumns;
                const leftPercent = (col * 100) / totalColumns;
                laidOut.push({
                    ...it,
                    __layout: {
                        totalColumns,
                        col,
                        style: {
                            top: `${it.top}px`,
                            height: `${it.height}px`,
                            left: `calc(12rem + ${leftPercent}%)`, // 12rem para gutter de horários (aprox . left-48)
                            width: `calc(${widthPercent}% - ${gutter}px)`
                        }
                    }
                });
            });
        });
        return laidOut;
    }

    const laidOut = layoutAppointments(appointments);

    const title = date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit' });
    const isClosedDay = date.getDay() === 0 || date.getDay() === 1;

    return (
        <div>
            <h3 className={`text-lg font-bold mb-2 text-center ${isClosedDay ? 'text-red-500' : ''}`}>{title}</h3>
            <div className="bg-gray-50 rounded-lg p-2 relative" style={{ height: (totalHours * 60 * PIXELS_PER_MINUTE) + 'px' }}>
                {/* Coluna de horários */}
                {hours.map(hour => (
                    <div key={hour} className="relative border-t border-gray-200" style={{ height: `${60 * PIXELS_PER_MINUTE}px` }}>
                        <span className="absolute -top-3 left-0 bg-gray-50 px-2 text-xs text-gray-500 w-44 text-right">{`${String(hour).padStart(2, '0')}:00`}</span>
                    </div>
                ))}
                {isClosedDay && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
                        <p className="font-semibold text-gray-500">Fechado</p>
                    </div>
                )}

                {/* Cards posicionados em colunas sem sobreposição */}
                {laidOut.map(apt => {
                    const startStr = new Date(apt.data_hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const endStr = new Date(apt.data_hora_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    return (
                        <div
                            key={apt.id}
                            className="absolute bg-white border-l-4 border-pink-500 rounded-md shadow-sm p-2 overflow-hidden hover:shadow-md"
                            style={apt.__layout.style}
                            title={`${apt.servico_nome} • ${startStr} - ${endStr} • ${apt.profissional_nome}`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-sm text-gray-800 truncate">{apt.servico_nome}</p>
                                <span className="text-[10px] font-medium text-gray-500">{startStr} - {endStr}</span>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{apt.cliente_nome} {apt.cliente_sobrenome}</p>
                            <p className="text-xs text-gray-600 truncate">Com: {apt.profissional_nome}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}