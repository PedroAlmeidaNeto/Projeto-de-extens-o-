import React from 'react';
import { Page } from '../types';
import { HomeIcon, UsersIcon, CalendarIcon, PawIcon, BoxIcon, TruckIcon } from './icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <li
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-slate-500 text-white shadow-md' : 'text-gray-600 hover:bg-slate-100 hover:text-slate-700'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { page: Page.Dashboard, label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
    { page: Page.Clients, label: 'Clientes', icon: <UsersIcon className="w-6 h-6" /> },
    { page: Page.Appointments, label: 'Agendamentos', icon: <CalendarIcon className="w-6 h-6" /> },
    { page: Page.Inventory, label: 'Estoque', icon: <BoxIcon className="w-6 h-6" /> },
    { page: Page.Suppliers, label: 'Fornecedores', icon: <TruckIcon className="w-6 h-6" /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-screen flex flex-col p-4">
      <div className="flex items-center mb-8 px-2">
        <PawIcon className="w-10 h-10 text-slate-600" />
        <h1 className="text-2xl font-bold ml-2 text-gray-800">Pat <span className="text-slate-500">Pet Shop</span></h1>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <NavItem
              key={item.page}
              icon={item.icon}
              label={item.label}
              isActive={currentPage === item.page}
              onClick={() => setCurrentPage(item.page)}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-center text-xs text-gray-400">
        <p>&copy; 2024 Pat Pet Shop</p>
        <p>Todos os direitos reservados.</p>
      </div>
    </aside>
  );
};