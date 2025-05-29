"use client";

import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-800 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Análises</h1>
        <p className="text-gray-400">
          Esta página está em desenvolvimento. Em breve, você terá acesso a análises detalhadas e relatórios personalizados.
        </p>
        <div className="mt-8 p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-300">
            Funcionalidades previstas:
          </p>
          <ul className="mt-2 list-disc pl-5 text-gray-400">
            <li>Gráficos de desempenho</li>
            <li>Relatórios de conversão</li>
            <li>Análise de funil de vendas</li>
            <li>Métricas personalizáveis</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
