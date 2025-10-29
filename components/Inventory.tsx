
import React, { useState, useMemo, useEffect } from 'react';
import { InventoryItem, InventoryCategory, InventoryUnit } from '../types';
import { Modal } from './Modal';
import { PlusIcon, EditIcon, TrashIcon } from './icons';

interface InventoryProps {
    inventory: InventoryItem[];
    addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
    updateInventoryItem: (item: InventoryItem) => void;
    deleteInventoryItem: (id: string) => void;
}

const InventoryForm: React.FC<{
    item?: InventoryItem | null;
    onSubmit: (data: Omit<InventoryItem, 'id'> | InventoryItem) => void;
    onClose: () => void;
}> = ({ item, onSubmit, onClose }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<InventoryCategory>(InventoryCategory.FOOD);
    const [quantity, setQuantity] = useState(0);
    const [unit, setUnit] = useState<InventoryUnit>(InventoryUnit.UNIT);
    const [supplier, setSupplier] = useState('');
    const [lastPurchaseDate, setLastPurchaseDate] = useState('');
    const [lowStockThreshold, setLowStockThreshold] = useState(0);

    useEffect(() => {
        if (item) {
            setName(item.name);
            setCategory(item.category);
            setQuantity(item.quantity);
            setUnit(item.unit);
            setSupplier(item.supplier);
            setLastPurchaseDate(item.lastPurchaseDate.split('T')[0]); // Format for date input
            setLowStockThreshold(item.lowStockThreshold);
        }
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { name, category, quantity, unit, supplier, lastPurchaseDate, lowStockThreshold };
        if (item) {
            onSubmit({ ...data, id: item.id });
        } else {
            onSubmit(data);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome do Item</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <select value={category} onChange={e => setCategory(e.target.value as InventoryCategory)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500">
                        {Object.values(InventoryCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                    <input type="number" min="0" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Unidade</label>
                    <select value={unit} onChange={e => setUnit(e.target.value as InventoryUnit)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500">
                        {Object.values(InventoryUnit).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Fornecedor</label>
                    <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Data da Última Compra</label>
                    <input type="date" value={lastPurchaseDate} onChange={e => setLastPurchaseDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Alerta de Estoque Baixo</label>
                    <input type="number" min="0" value={lowStockThreshold} onChange={e => setLowStockThreshold(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500" required />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">Salvar Item</button>
            </div>
        </form>
    );
};


export const Inventory: React.FC<InventoryProps> = ({ inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInventory = useMemo(() =>
        inventory.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [inventory, searchTerm]
    );
    
    const handleEdit = (item: InventoryItem) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setEditingItem(null);
        setModalOpen(false);
    };

    const handleSubmit = (data: Omit<InventoryItem, 'id'> | InventoryItem) => {
        if ('id' in data) {
            updateInventoryItem(data);
        } else {
            addInventoryItem(data);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
            deleteInventoryItem(id);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800">Gestão de Estoque</h1>
                <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 shadow">
                    <PlusIcon className="w-5 h-5 mr-2" /> Novo Item
                </button>
            </div>

            <div className="mb-6">
                 <input
                    type="text"
                    placeholder="Buscar item por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Compra</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredInventory.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                       <span className={`text-sm font-medium ${item.quantity <= item.lowStockThreshold ? 'text-red-600' : 'text-gray-900'}`}>{item.quantity} {item.unit}</span>
                                       {item.quantity <= item.lowStockThreshold && <span className="ml-2 w-3 h-3 bg-red-500 rounded-full" title="Estoque baixo"></span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.supplier}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.lastPurchaseDate).toLocaleDateString('pt-BR')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(item)} className="text-teal-600 hover:text-teal-900 mr-4">
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredInventory.length === 0 && <p className="p-4 text-center text-gray-500">Nenhum item encontrado.</p>}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? "Editar Item de Estoque" : "Adicionar Novo Item de Estoque"}>
                <InventoryForm item={editingItem} onSubmit={handleSubmit} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};
