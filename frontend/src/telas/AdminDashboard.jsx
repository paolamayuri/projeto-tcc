// screens/AdminDashboard.jsx (VERSÃO FINAL COMPLETA E CORRIGIDA)

import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { PlusIcon } from '../componentes/Icons';

// Importando TODOS os componentes do admin
import AgendaTimelineView from '../componentes/Administrador/AgendaTimelineView';
import AppointmentList from '../componentes/Administrador/AppointmentList';
import ClientList from '../componentes/Administrador/ClientList';
import ServiceManager from '../componentes/Administrador/ServiceManager';
import ProfessionalManager from '../componentes/Administrador/ProfessionalManager';
import ConfirmationModal from '../componentes/Administrador/ConfirmationModal';
import ServiceModal from '../componentes/Administrador/ServiceModal';
import ProfessionalModal from '../componentes/Administrador/ProfessionalModal';
import UserEditModal from '../componentes/Administrador/UserEditModal';
import AppointmentModal from '../componentes/Administrador/AppointmentModal';

export default function AdminDashboard({ user, onLogout }) {
    const [view, setView] = useState('agenda');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados de controle dos modais
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [isServiceModalOpen, setServiceModalOpen] = useState(false);
    const [isProfessionalModalOpen, setProfessionalModalOpen] = useState(false);
    const [isUserEditModalOpen, setUserEditModalOpen] = useState(false);
    const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);
    
    // Estados para guardar dados para edição ou deleção
    const [itemToProcess, setItemToProcess] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [editingProfessional, setEditingProfessional] = useState(null);
    const [editingUser, setEditingUser] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        let endpoint = '/admin/appointments';
        if (view === 'clients') endpoint = '/admin/clients';
        if (view === 'services') endpoint = '/services';
        if (view === 'professionals') endpoint = '/professionals';
        
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
            setData(response.data);
        } catch (error) {
            console.error(`Erro ao buscar dados para ${view}:`, error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Sessão expirada. Faça login novamente.");
                onLogout();
            }
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [view, onLogout]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const openDeleteConfirmation = (id, type) => {
        setItemToProcess({ type, id });
        setConfirmOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!itemToProcess) return;
        const { type, id } = itemToProcess;
        try {
            const token = localStorage.getItem('token');
            let url = '';
            if (type === 'appointment') url = `/appointments/${id}`;
            else if (type === 'service') url = `/admin/services/${id}`;
            else if (type === 'professional') url = `/admin/professionals/${id}`;
            else return;
            
            await api.delete(url, { headers: { Authorization: `Bearer ${token}` } });
            toast.success(`Item excluído com sucesso!`);
            fetchData();
        } catch (error) {
            const errorMessage = error.response?.data?.message || `Não foi possível excluir o item.`;
            toast.error(errorMessage);
        } finally {
            setConfirmOpen(false);
            setItemToProcess(null);
        }
    };

    const handleOpenServiceModal = (service = null) => {
        setEditingService(service);
        setServiceModalOpen(true);
    };
    
    const handleOpenProfessionalModal = (professional = null) => {
        setEditingProfessional(professional);
        setProfessionalModalOpen(true);
    };
    
    const handleOpenUserEditModal = (userToEdit) => {
        setEditingUser(userToEdit);
        setUserEditModalOpen(true);
    };

    return (
        <>
            <div className="bg-gray-100 flex items-center justify-center min-h-screen">
                <div className="w-full max-w-7xl mx-auto p-4">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <header className="p-6 border-b flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Painel do Administrador</h2>
                                <p className="text-gray-500">Bem-vindo, {user.nome}!</p>
                            </div>
                            <button onClick={onLogout} className="text-sm font-medium text-red-500">Sair</button>
                        </header>
                        <nav className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <div className="flex space-x-2">
                                <button onClick={() => setView('agenda')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'agenda' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>Agenda</button>
                                <button onClick={() => setView('appointments')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'appointments' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>Agendamentos</button>
                                <button onClick={() => setView('clients')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'clients' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>Clientes</button>
                                <button onClick={() => setView('services')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'services' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>Serviços</button>
                                <button onClick={() => setView('professionals')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'professionals' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}>Profissionais</button>
                            </div>
                            <div>
                                {view === 'services' && <button onClick={() => handleOpenServiceModal()} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 flex items-center"><PlusIcon />Novo Serviço</button>}
                                {view === 'professionals' && <button onClick={() => handleOpenProfessionalModal()} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 flex items-center"><PlusIcon />Novo Profissional</button>}
                                {(view === 'agenda' || view === 'appointments') && <button onClick={() => setAppointmentModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-500 text-white hover:bg-green-600 flex items-center"><PlusIcon />Agendar para Cliente</button>}
                            </div>
                        </nav>
                        <main className="p-6 max-h-[65vh] overflow-y-auto">
                            {loading ? <p className="text-center">A carregar...</p> : (
                                <>
                                    {view === 'agenda' && <AgendaTimelineView appointments={data} />}
                                    {view === 'appointments' && <AppointmentList appointments={data} onCancel={(id) => openDeleteConfirmation(id, 'appointment')} />}
                                    {view === 'clients' && <ClientList clients={data} onEdit={handleOpenUserEditModal} />}
                                    {view === 'services' && <ServiceManager services={data} onEdit={handleOpenServiceModal} onDelete={(id) => openDeleteConfirmation(id, 'service')} />}
                                    {view === 'professionals' && <ProfessionalManager professionals={data} onEdit={handleOpenProfessionalModal} onDelete={(id) => openDeleteConfirmation(id, 'professional')} />}
                                </>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            {/* Renderização Condicional de Todos os Modais */}
            {isConfirmOpen && <ConfirmationModal message={`Tem certeza que deseja apagar este ${itemToProcess.type}?`} onConfirm={handleConfirmAction} onCancel={() => setConfirmOpen(false)} />}
            {isServiceModalOpen && <ServiceModal service={editingService} onClose={() => setServiceModalOpen(false)} onSave={fetchData} />}
            {isProfessionalModalOpen && <ProfessionalModal professional={editingProfessional} onClose={() => setProfessionalModalOpen(false)} onSave={fetchData} />}
            {isUserEditModalOpen && <UserEditModal userToEdit={editingUser} onClose={() => setUserEditModalOpen(false)} onSave={fetchData} />}
            {isAppointmentModalOpen && <AppointmentModal onClose={() => setAppointmentModalOpen(false)} onAppointmentCreated={fetchData} />}
        </>
    );
}