import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Program } from '../types/program';
import { Plus, Search, Edit2, Trash2, Tag } from 'lucide-react';
import { ProgramForm } from '../features/admin/ProgramForm';

export const AdminPrograms = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);

    const fetchPrograms = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('programs')
                .select('*')
                .order('created_at', { ascending: false });

            if (searchQuery.trim() !== '') {
                query = query.ilike('name', `%${searchQuery}%`);
            }

            const { data, error } = await query;
            if (error) throw error;

            setPrograms(data || []);
        } catch (error) {
            console.error('Error fetching programs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPrograms();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this program?")) return;

        try {
            const { error } = await supabase.from('programs').delete().eq('id', id);
            if (error) throw error;
            fetchPrograms();
        } catch (err: any) {
            console.error("Delete failed", err);
            alert("Failed to delete program: " + err.message);
        }
    };

    const handleEdit = (program: Program) => {
        setEditingProgram(program);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingProgram(null);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Programs</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage promotional programs and sales events.</p>
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    Create Program
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search programs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Program Name</th>
                                <th className="px-6 py-4">Period</th>
                                <th className="px-6 py-4">SKUs</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading programs...</td>
                                </tr>
                            ) : programs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Tag size={32} className="mb-2 opacity-50" />
                                            <p>No programs found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                programs.map((program) => (
                                    <tr key={program.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-900 font-medium">{program.name}</td>
                                        <td className="px-6 py-4">{program.period || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-medium text-xs">
                                                {program.skus.length} SKUs
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${program.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                                {program.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(program)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit Program"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(program.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Program"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isFormOpen && (
                <ProgramForm
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        fetchPrograms();
                    }}
                    programToEdit={editingProgram}
                />
            )}
        </div>
    );
};
