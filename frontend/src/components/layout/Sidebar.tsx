"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Definição de tipos para os itens do menu
interface MenuItem {
  id: string;
  name: string;
  icon: string; // Nome do ícone (usaremos caracteres Unicode simples por enquanto)
  path: string;
}

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const pathname = usePathname();
  
  // Itens do menu - futuramente podem vir de uma API ou configuração
  const menuItems: MenuItem[] = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', path: '/admin/dashboard' },
    { id: 'analytics', name: 'Análises', icon: '📊', path: '/admin/analytics' },
    { id: 'leads', name: 'Leads', icon: '👥', path: '/admin/leads' },
    { id: 'chat', name: 'Chat IA', icon: '💬', path: '/admin/chat' },
    { id: 'settings', name: 'Configurações', icon: '⚙️', path: '/admin/settings' },
  ];

  // Itens do submenu de configurações
  const settingsSubItems = [
    { id: 'clients', name: 'Clientes', icon: '👥', path: '/admin/settings/clients' },
    { id: 'chart-configs', name: 'Configuração Análises', icon: '📊', path: '/admin/settings/chart-configs' },
    { id: 'dashboard-config', name: 'Configuração Leads', icon: '👥', path: '/admin/settings/leads' },
    { id: 'dashboard-config', name: 'Configuração Dashboard', icon: '🏠', path: '/admin/settings/dashboard' },
  ];

  return (
    <aside 
      className={`h-screen transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } fixed left-0 top-0 z-10`}
      style={{ backgroundColor: '#1C1C1C' }}
    >
      {/* Header com logo e botão de toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center">
            <Image 
              src="/images/logo9-fundo_escuro.png"
              alt="Kapexia CRM"
              width={180}
              height={101}
              className="object-contain"
            />
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center w-full">
            <Image 
              src="/images/logo9-fundo_escuro.png"
              alt="Kapexia CRM"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        )}
        {!collapsed && (
          <button 
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            ←
          </button>
        )}
      </div>

      {/* Menu de navegação */}
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              {item.id === 'settings' ? (
                // Menu de configurações com submenu
                <div>
                  <Link 
                    href={item.path}
                    className={`flex items-center px-4 py-3 ${
                      pathname.startsWith('/admin/settings') 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    } transition-colors duration-200 ${
                      collapsed ? 'justify-center' : ''
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!collapsed && <span className="ml-4">{item.name}</span>}
                  </Link>
                  
                  {/* Submenu de configurações */}
                  {!collapsed && pathname.startsWith('/admin/settings') && (
                    <ul className="ml-8 mt-2 space-y-1">
                      {settingsSubItems.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            href={subItem.path}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                              pathname === subItem.path || pathname.startsWith(subItem.path + '/')
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            <span className="mr-3">{subItem.icon}</span>
                            <span>{subItem.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Itens normais do menu
                <Link 
                  href={item.path}
                  className={`flex items-center px-4 py-3 ${
                    pathname === item.path 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  } transition-colors duration-200 ${
                    collapsed ? 'justify-center' : ''
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!collapsed && <span className="ml-4">{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer com informações do usuário - futuramente virá da sessão */}
      <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">admin@kapexia.com</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
              A
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
