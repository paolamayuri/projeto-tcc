// src/components/Admin/ProfessionalModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify'; // <-- 1. IMPORTAR O TOAST

export default function ProfessionalModal({ professional, onClose, onSave }) {
    const [nome, setNome] = useState(professional?.nome || '');
    const [foto, setFoto] = useState(professional?.foto || '');
    const [servicosAtendidos, setServicosAtendidos] = useState(professional?.servicos_oferecidos?.map(s => s.id) || []);
    const [availableServices, setAvailableServices] = useState([]);
    // O estado de 'error' não é mais necessário.
    // const [error, setError] = useState('');

    useEffect(() => {
        api.get('/services')
            .then(res => setAvailableServices(res.data))
            .catch(err => console.error("Erro ao carregar serviços:", err));
    }, []);

    const handleServiceToggle = (serviceId) => {
        setServicosAtendidos(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nome) {
            toast.error('O nome do profissional é obrigatório.'); // <-- 2. USAR O TOAST PARA ERRO
            return;
        }

        const token = localStorage.getItem('token');
        const payload = { nome, foto, servicosAtendidos };

        try {
            if (professional) {
                await api.put(`/admin/professionals/${professional.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await api.post('/admin/professionals', payload, { headers: { Authorization: `Bearer ${token}` } });
            }
            
            toast.success('Profissional salvo com sucesso!'); // <-- 3. USAR O TOAST PARA SUCESSO
            
            onSave();
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao salvar profissional.';
            toast.error(errorMessage); // <-- 4. USAR O TOAST PARA ERRO DA API
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b"><h3 className="text-xl font-bold">{professional ? 'Editar Profissional' : 'Novo Profissional'}</h3></div>
                    <div className="p-6 space-y-4">
                        {/* O <p> de erro foi removido daqui */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Nome do Profissional</label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">URL da Foto</label>
                            <input type="text" value={foto} onChange={e => setFoto(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: https://.../foto.jpg" />
                            {foto && <img src={foto} alt="Pré-visualização" className="mt-2 w-24 h-24 object-cover rounded-full mx-auto border" onError={(e) => e.target.src = 'https://placehold.co/150x150/cccccc/ffffff?text=Erro'} />}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Serviços que Atende:</label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded-lg bg-gray-50">
                                {availableServices.map(service => (
                                    <label key={service.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={servicosAtendidos.includes(service.id)} onChange={() => handleServiceToggle(service.id)} className="form-checkbox text-blue-600 rounded" />
                                        <span>{service.nome}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}