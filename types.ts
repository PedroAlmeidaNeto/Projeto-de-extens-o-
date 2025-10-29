
export interface Pet {
  id: string;
  name: string;
  species: 'Cachorro' | 'Gato' | 'Pássaro' | 'Roedor' | 'Outro';
  breed: string;
  birthDate: string; // ISO string format
  ownerId: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export enum AppointmentStatus {
  SCHEDULED = 'Agendado',
  COMPLETED = 'Concluído',
  CANCELED = 'Cancelado'
}

export interface Appointment {
  id:string;
  clientId: string;
  petId: string;
  date: string; // ISO string format with time
  reason: string;
  notes?: string;
  status: AppointmentStatus;
}

export enum InventoryCategory {
  FOOD = 'Ração',
  HYGIENE = 'Higiene e Banho',
  MEDICINE = 'Medicamentos',
  ACCESSORIES = 'Acessórios'
}

export enum InventoryUnit {
  KG = 'kg',
  L = 'L',
  UNIT = 'un'
}

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: InventoryUnit;
  supplier: string;
  lastPurchaseDate: string; // ISO string format
  lowStockThreshold: number;
}

export enum Page {
  Dashboard = 'Dashboard',
  Clients = 'Clientes',
  Appointments = 'Agendamentos',
  Inventory = 'Estoque',
}
