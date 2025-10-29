import React, { useState, useCallback } from 'react';
import { Client, Pet, Appointment, Page, AppointmentStatus, InventoryItem, InventoryCategory, InventoryUnit, Supplier } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { Appointments } from './components/Appointments';
import { Inventory } from './components/Inventory';
import { VirtualAssistant } from './components/VirtualAssistant';
import { ChatBubbleIcon } from './components/icons';
import { Suppliers } from './components/Suppliers';

const initialClients: Client[] = [
    { id: '1', name: 'João da Silva', email: 'joao.silva@example.com', phone: '(11) 98765-4321', address: 'Rua das Flores, 123, São Paulo, SP' },
    { id: '2', name: 'Maria Oliveira', email: 'maria.oliveira@example.com', phone: '(21) 91234-5678', address: 'Avenida Copacabana, 456, Rio de Janeiro, RJ' },
];
const initialPets: Pet[] = [
    { id: 'p1', ownerId: '1', name: 'Rex', species: 'Cachorro', breed: 'Labrador', birthDate: '2020-05-10' },
    { id: 'p2', ownerId: '1', name: 'Mimi', species: 'Gato', breed: 'Siamês', birthDate: '2021-01-15' },
    { id: 'p3', ownerId: '2', name: 'Pingo', species: 'Cachorro', breed: 'Poodle', birthDate: '2019-11-20' },
];
const initialAppointments: Appointment[] = [
    { id: 'a1', clientId: '1', petId: 'p1', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), reason: 'Vacina anual', status: AppointmentStatus.SCHEDULED },
    { id: 'a2', clientId: '2', petId: 'p3', date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), reason: 'Check-up de rotina', status: AppointmentStatus.COMPLETED },
];

const initialSuppliers: Supplier[] = [
    { id: 's1', name: 'PetFood Inc.', contactPerson: 'Carlos Mendes', phone: '(11) 5555-1234', email: 'vendas@petfoodinc.com' },
    { id: 's2', name: 'CleanPet', contactPerson: 'Ana Costa', phone: '(21) 5555-5678', email: 'contato@cleanpet.com' },
];

const initialInventory: InventoryItem[] = [
    { id: 'i1', name: 'Ração Seca para Cães Adultos', category: InventoryCategory.FOOD, quantity: 4, unit: InventoryUnit.KG, supplierId: 's1', lastPurchaseDate: '2024-05-10', lowStockThreshold: 5 },
    { id: 'i2', name: 'Shampoo Hipoalergênico', category: InventoryCategory.HYGIENE, quantity: 2, unit: InventoryUnit.UNIT, supplierId: 's2', lastPurchaseDate: '2024-05-20', lowStockThreshold: 3 },
    { id: 'i3', name: 'Ração Úmida para Gatos', category: InventoryCategory.FOOD, quantity: 48, unit: InventoryUnit.UNIT, supplierId: 's1', lastPurchaseDate: '2024-06-01', lowStockThreshold: 12 },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [clients, setClients] = useLocalStorage<Client[]>('patpetshop_clients', initialClients);
  const [pets, setPets] = useLocalStorage<Pet[]>('patpetshop_pets', initialPets);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('patpetshop_appointments', initialAppointments);
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('patpetshop_inventory', initialInventory);
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('patpetshop_suppliers', initialSuppliers);
  const [isAssistantOpen, setAssistantOpen] = useState(false);


  const addClient = useCallback((clientData: Omit<Client, 'id'>) => {
    const newClient: Client = { ...clientData, id: crypto.randomUUID() };
    setClients(prev => [...prev, newClient]);
  }, [setClients]);

  const addPet = useCallback((petData: Omit<Pet, 'id'>) => {
    const newPet: Pet = { ...petData, id: crypto.randomUUID() };
    setPets(prev => [...prev, newPet]);
  }, [setPets]);

  const addAppointment = useCallback((appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = { ...appointmentData, id: crypto.randomUUID() };
    setAppointments(prev => [...prev, newAppointment]);
  }, [setAppointments]);

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  }, [setAppointments]);

  const addInventoryItem = useCallback((itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...itemData, id: crypto.randomUUID() };
    setInventory(prev => [...prev, newItem]);
  }, [setInventory]);

  const updateInventoryItem = useCallback((updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, [setInventory]);
  
  const deleteInventoryItem = useCallback((id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  }, [setInventory]);

  const addSupplier = useCallback((supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = { ...supplierData, id: crypto.randomUUID() };
    setSuppliers(prev => [...prev, newSupplier]);
    }, [setSuppliers]);

  const updateSupplier = useCallback((updatedSupplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
    }, [setSuppliers]);

  const deleteSupplier = useCallback((id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    }, [setSuppliers]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard clients={clients} pets={pets} appointments={appointments} />;
      case Page.Clients:
        return <Clients clients={clients} pets={pets} addClient={addClient} addPet={addPet} />;
      case Page.Appointments:
        return <Appointments appointments={appointments} clients={clients} pets={pets} addAppointment={addAppointment} updateAppointmentStatus={updateAppointmentStatus} />;
      case Page.Inventory:
        return <Inventory inventory={inventory} suppliers={suppliers} addInventoryItem={addInventoryItem} updateInventoryItem={updateInventoryItem} deleteInventoryItem={deleteInventoryItem} />;
      case Page.Suppliers:
        return <Suppliers suppliers={suppliers} addSupplier={addSupplier} updateSupplier={updateSupplier} deleteSupplier={deleteSupplier} />;
      default:
        return <Dashboard clients={clients} pets={pets} appointments={appointments} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-gray-800">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-y-auto relative">
        {renderPage()}

        <div className="absolute bottom-8 right-8 z-50">
           <button 
             onClick={() => setAssistantOpen(!isAssistantOpen)} 
             className="bg-slate-500 text-white rounded-full p-4 shadow-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-transform transform hover:scale-110"
             aria-label="Open virtual assistant"
           >
             <ChatBubbleIcon className="w-8 h-8" />
           </button>
        </div>
        
        <VirtualAssistant 
          isOpen={isAssistantOpen} 
          onClose={() => setAssistantOpen(false)}
          clients={clients}
          pets={pets}
          appointments={appointments}
        />

      </main>
    </div>
  );
}

export default App;