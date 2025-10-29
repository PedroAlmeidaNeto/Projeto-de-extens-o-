import React, { useState, useMemo, useEffect } from 'react';
import { Supplier } from '../types';
import { Modal } from './Modal';
import { PlusIcon, EditIcon, TrashIcon, TruckIcon } from './icons';

interface SuppliersProps {
    suppliers: Supplier[];
    addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
    updateSupplier: (supplier: Supplier) => void;
    deleteSupplier: (id: string) => void;
}

const SupplierForm: React.FC<{
    supplier?: Supplier | null;
    onSubmit: (data: Omit<Supplier, 'id'> | Supplier) => void;
    onClose: () => void;
}> = ({ supplier, onSubmit, onClose }) => {
    const [name, setName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (supplier) {
            setName(supplier.name);
            setContactPerson(supplier.contactPerson);
            setPhone(supplier.phone);
            setEmail(supplier.email);
        } else {
            setName('');
            setContactPerson('');
            setPhone('');
            setEmail('');
        }
    }, [supplier]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { name, contactPerson, phone, email };
        if (supplier) {
            onSubmit({ ...data, id: supplier.id });
        } else {
            onSubmit(data);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-slate-500 focus:border-slate-500" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Nome do Contato</label>
                <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-slate-500 focus:border-slate-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-slate-500 focus:border-slate-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-slate-500 focus:border-slate-500" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600">Salvar Fornecedor</button>
            </div>
        </form>
    );
};


export const Suppliers: React.FC<SuppliersProps> = ({ suppliers, addSupplier, updateSupplier, deleteSupplier }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSuppliers = useMemo(() =>
        suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())),
        [suppliers, searchTerm]
    );
    
    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingSupplier(null);
        setModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setEditingSupplier(null);
        setModalOpen(false);
    };

    const handleSubmit = (data: Omit<Supplier, 'id'> | Supplier) => {
        if ('id' in data) {
            updateSupplier(data);
        } else {
            addSupplier(data);
        }
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
            deleteSupplier(id);
        }
    };


    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800">Fornecedores</h1>
                <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 shadow">
                    <PlusIcon className="w-5 h-5 mr-2" /> Novo Fornecedor
                </button>
            </div>

            <div className="mb-6">
                 <input 
                    type="text" 
                    placeholder="Buscar fornecedor por nome ou contato..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                 <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredSuppliers.map(supplier => (
                            <tr key={supplier.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-slate-100 rounded-full mr-4">
                                            <TruckIcon className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.contactPerson}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(supplier)} className="text-slate-600 hover:text-slate-900 mr-4">
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(supplier.id)} className="text-red-600 hover:text-red-900">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredSuppliers.length === 0 && <p className="p-4 text-center text-gray-500">Nenhum fornecedor encontrado.</p>}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingSupplier ? "Editar Fornecedor" : "Adicionar Novo Fornecedor"}>
                <SupplierForm supplier={editingSupplier} onSubmit={handleSubmit} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};