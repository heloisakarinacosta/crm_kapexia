import React from 'react';
import Link from 'next/link';
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

  return (
    <aside 
      className={`bg-gray-900 h-screen transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } fixed left-0 top-0 z-10`}
    >
      {/* Header com logo e botão de toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {!collapsed && (
          <div className="text-xl font-bold text-white">Kapexia CRM</div>
        )}
        <button 
          onClick={toggleSidebar}
          className={`text-gray-400 hover:text-white focus:outline-none ${
            collapsed ? 'mx-auto' : ''
          }`}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Menu de navegação */}
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
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
