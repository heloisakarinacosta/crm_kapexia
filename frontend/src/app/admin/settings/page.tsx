"use client";

import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-800 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Configurações</h1>
        <p className="text-gray-400">
          Esta página está em desenvolvimento. Em breve, você terá acesso às configurações completas do sistema.
        </p>
        <div className="mt-8 p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-300">
            Funcionalidades previstas:
          </p>
          <ul className="mt-2 list-disc pl-5 text-gray-400">
            <li>Configurações de perfil e conta</li>
            <li>Preferências de notificações</li>
            <li>Configuração de integrações</li>
            <li>Gestão de utilizadores e permissões</li>
            <li>Personalização da interface</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
