// src/components/Booking/ServiceSelectionStep.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function ServiceSelectionStep({ onContinue }) {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    useEffect(() => {
        api.get('/services')
            .then(res => setServices(res.data))
            .catch(error => console.error("Erro ao buscar serviços:", error));
    }, []);

    const toggleService = (service) => {
        setSelectedServices([service]);
    };

    const isSelected = (service) => selectedServices.some(s => s.id === service.id);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => (
                    <div key={service.id} onClick={() => toggleService(service)}
                        className={`bg-white p-6 rounded-lg shadow-md text-left cursor-pointer border-2 ${isSelected(service) ? 'border-pink-500' : 'border-transparent'} hover:shadow-lg`}>
                        <h3 className="font-bold text-lg text-gray-800">{service.nome}</h3>
                        <p className="text-sm text-gray-500">{service.duracao} min</p>
                        <p className="text-sm text-gray-600">R$ {service.preco !== undefined && service.preco !== null ? service.preco.toFixed(2) : '0.00'}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <button onClick={() => onContinue(selectedServices)} disabled={selectedServices.length === 0}
                    className="bg-pink-500 text-white px-10 py-3 rounded-full font-semibold disabled:bg-gray-300">
                    Continuar
                </button>
            </div>
        </div>
    );
}