"use client";

import React from 'react';
// import { useRouter } from 'next/navigation'; // Uncomment if needed for logout or other navigation
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock user data - in a real app, this would come from auth context or API
const mockUser = {
  username: "admin",
  email: "admin@kapexia.com",
};

export default function AdminDashboardPage() {
  // const router = useRouter(); // Uncomment if needed

  // const handleLogout = () => {
  //   // Implement logout logic here (e.g., clear token, redirect to login)
  //   console.log("Logout clicked");
  //   // router.push('/login/admin/login');
  // };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header/Navbar Placeholder */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">KapexiaCore CRM - Admin Dashboard</h1>
          {/* <Button onClick={handleLogout} variant="outline">Logout</Button> */}
          <button 
            onClick={() => console.log("Logout clicked (simulated)")}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout (Simulated)
          </button>
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Message */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Bem-vindo, {mockUser.username}!</h2>
            <p className="text-gray-600">Este é o seu painel de administração. A partir daqui, poderá gerir as configurações globais do KapexiaCore CRM.</p>
          </div>

          {/* Placeholder for Admin Functionalities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card for Subscription Plans Management */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Gerir Planos de Assinatura</h3>
                <p className="mt-1 text-sm text-gray-500">Definir e editar planos (Básico, Pro, Enterprise), preços e funcionalidades incluídas.</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                {/* <Button variant="link">Aceder Gestão de Planos</Button> */}
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Aceder Gestão de Planos (Placeholder)</a>
              </div>
            </div>

            {/* Card for AI Configuration */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Configurar IA Global</h3>
                <p className="mt-1 text-sm text-gray-500">Gerir funcionalidades da IA, limites de "uso justo" ou pacotes de IA por plano.</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Aceder Configurações de IA (Placeholder)</a>
              </div>
            </div>

            {/* Card for Email Templates */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Gerir Templates de E-mail</h3>
                <p className="mt-1 text-sm text-gray-500">Criar e editar templates para e-mails do sistema (boas-vindas, notificações, etc.).</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Aceder Gestão de Templates (Placeholder)</a>
              </div>
            </div>

            {/* Card for System Integrations */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Configurar Integrações</h3>
                <p className="mt-1 text-sm text-gray-500">Gerir integrações a nível de sistema (ex: gateway de pagamento Stripe).</p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Aceder Gestão de Integrações (Placeholder)</a>
              </div>
            </div>

            {/* Add more cards for other admin functionalities as needed */}
          </div>
        </div>
      </main>

      {/* Footer Placeholder */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Kapexia. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

