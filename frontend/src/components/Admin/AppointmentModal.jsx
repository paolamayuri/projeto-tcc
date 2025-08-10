// src/components/Admin/AppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function AppointmentModal({ onClose, onAppointmentCreated }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [observations, setObservations] = useState('');
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        api.get('/admin/clients', { headers: { Authorization: `Bearer ${token}` } }).then(res => setUsers(res.data));
        api.get('/services').then(res => setServices(res.data));
        api.get('/professionals').then(res => setProfessionals(res.data));
    }, []);

    useEffect(() => {
        if (selectedDate && selectedService && selectedProfessional) {
            api.get(`/availability?date=${selectedDate}&serviceId=${selectedService.id}&professionalId=${selectedProfessional.id}`)
                .then(res => setAvailableSlots(res.data))
                .catch(err => {
                    console.error("Erro ao buscar horários:", err);
                    setAvailableSlots([]);
                });
        }
    }, [selectedDate, selectedService, selectedProfessional]);

    const handleConfirm = async () => {
        setError('');
        if (!selectedUser || !selectedService || !selectedProfessional || !selectedDateTime) {
            setError('Por favor, preencha todos os campos do agendamento.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const payload = {
                id_usuario: selectedUser.id,
                id_servico: selectedService.id,
                id_profissional: selectedProfessional.id,
                data_hora_inicio: selectedDateTime,
                observacao: observations
            };
            await api.post('/appointments', payload, { headers: { Authorization: `Bearer ${token}` } });
            onAppointmentCreated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao criar agendamento.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">Agendar para Cliente</h3><button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button></div>
                <div className="p-6 space-y-4">
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</p>}
                    
                    {/* Seções para selecionar cliente, serviço, etc. */}
                    {/* Esta é uma implementação simplificada, você pode melhorar o fluxo depois */}
                    <div className='space-y-4'>
                        <div>
                            <label className="block text-sm font-medium mb-1">1. Cliente</label>
                            <select onChange={(e) => setSelectedUser(users.find(u => u.id === parseInt(e.target.value)))} className="w-full p-2 border rounded-lg">
                                <option>Selecione um cliente</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.nome} {u.sobrenome}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">2. Serviço</label>
                            <select onChange={(e) => setSelectedService(services.find(s => s.id === parseInt(e.target.value)))} className="w-full p-2 border rounded-lg">
                                <option>Selecione um serviço</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">3. Profissional</label>
                            <select onChange={(e) => setSelectedProfessional(professionals.find(p => p.id === parseInt(e.target.value)))} className="w-full p-2 border rounded-lg">
                                <option>Selecione um profissional</option>
                                {professionals.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">4. Data e Hora</label>
                            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full p-2 border rounded-lg mb-2"/>
                            <div className="grid grid-cols-4 gap-2">
                                {availableSlots.map(slot => <button key={slot} onClick={() => setSelectedDateTime(slot)} className={`p-2 rounded ${selectedDateTime === slot ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>{new Date(slot).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</button>)}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Observações</label>
                            <textarea value={observations} onChange={e => setObservations(e.target.value)} className="w-full p-2 border rounded-lg" rows="2"></textarea>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end"><button onClick={handleConfirm} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Confirmar Agendamento</button></div>
            </div>
        </div>
    );
}