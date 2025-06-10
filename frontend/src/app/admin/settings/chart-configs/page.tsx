"use client";

import React from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

export default function ChartConfigsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-800 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Configuração de Gráficos</h1>
        <p className="text-gray-400">
          Esta página está em desenvolvimento. Em breve, você terá acesso à configuração dos gráficos por cliente.
        </p>
        <div className="mt-8 p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-300">
            Funcionalidades previstas:
          </p>
          <ul className="mt-2 list-disc pl-5 text-gray-400">
            <li>Configuração de conexão a bases de dados externas</li>
            <li>Configuração de SQLs personalizados por gráfico</li>
            <li>Seleção de tipo de gráfico</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}


