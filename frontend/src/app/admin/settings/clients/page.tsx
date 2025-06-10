"use client";

import React from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-800 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Gestão de Clientes</h1>
        <p className="text-gray-400">
          Esta página está em desenvolvimento. Em breve, você terá acesso à gestão completa de clientes.
        </p>
        <div className="mt-8 p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-300">
            Funcionalidades previstas:
          </p>
          <ul className="mt-2 list-disc pl-5 text-gray-400">
            <li>Cadastro de clientes</li>
            <li>Listagem e edição de clientes</li>
            <li>Associação de utilizadores a clientes</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}


