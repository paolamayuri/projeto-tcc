// src/components/Admin/ConfirmationModal.jsx
import React from 'react';

export default function ConfirmationModal({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-30">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
                <p className="text-lg font-semibold mb-6">{message}</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                    <button onClick={onConfirm} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Confirmar</button>
                </div>
            </div>
        </div>
    );
}