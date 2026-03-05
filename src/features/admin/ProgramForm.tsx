import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Program } from '../../types/program';
import { X, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import Papa from 'papaparse';

interface ProgramFormProps {
    onClose: () => void;
    onSuccess: () => void;
    programToEdit?: Program | null;
}

export const ProgramForm = ({ onClose, onSuccess, programToEdit }: ProgramFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        period: '',
        description: '',
        is_active: true
    });

    const [skus, setSkus] = useState<string[]>([]);
    const [skuInput, setSkuInput] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (programToEdit) {
            setFormData({
                name: programToEdit.name,
                period: programToEdit.period || '',
                description: programToEdit.description || '',
                is_active: programToEdit.is_active
            });
            setSkus(programToEdit.skus || []);

            if (programToEdit.period) {
                const dates = programToEdit.period.split(' to ');
                if (dates.length === 2) {
                    setStartDate(dates[0]);
                    setEndDate(dates[1]);
                }
            }
        }
    }, [programToEdit]);

    const handleAddSku = (e?: React.KeyboardEvent) => {
        if (e && e.key !== 'Enter') return;
        e?.preventDefault();

        // Handle bulk pasting (split by comma, newline, or multiple spaces)
        const pastedContent = skuInput.trim();
        if (!pastedContent) return;

        const rawSkus = pastedContent.split(/[\n,]+|\s{2,}/);
        const newSkus = rawSkus
            .map(s => s.trim().toUpperCase())
            .filter(s => s.length > 0 && !skus.includes(s));

        if (newSkus.length > 0) {
            setSkus([...skus, ...newSkus]);
        }
        setSkuInput('');
    };

    const handleClearSkus = () => {
        if (window.confirm('Are you sure you want to clear all SKUs?')) {
            setSkus([]);
        }
    };

    const removeSku = (indexToRemove: number) => {
        setSkus(skus.filter((_, index) => index !== indexToRemove));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const newSkus: string[] = [];
                results.data.forEach((row: any) => {
                    // Look for a column named 'sku' or 'SKU'
                    const sku = row.sku || row.SKU;
                    if (sku) {
                        const cleanSku = sku.toString().trim().toUpperCase();
                        if (cleanSku && !skus.includes(cleanSku) && !newSkus.includes(cleanSku)) {
                            newSkus.push(cleanSku);
                        }
                    }
                });

                if (newSkus.length > 0) {
                    setSkus(prev => [...prev, ...newSkus]);
                } else {
                    alert('No valid SKUs found in the CSV. Make sure there is a column header named "sku".');
                }

                // Reset file input
                if (e.target) {
                    e.target.value = '';
                }
            },
            error: (err) => {
                console.error("CSV Parse Error:", err);
                alert("Failed to parse CSV file.");
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Combine dates for period representation
        const formattedPeriod = (startDate && endDate) ? `${startDate} to ${endDate}` : null;

        try {
            if (programToEdit) {
                const { error: updateError } = await supabase
                    .from('programs')
                    .update({
                        name: formData.name,
                        period: formattedPeriod,
                        description: formData.description || null,
                        skus,
                        is_active: formData.is_active,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', programToEdit.id);

                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('programs')
                    .insert({
                        name: formData.name,
                        period: formattedPeriod,
                        description: formData.description || null,
                        skus,
                        is_active: formData.is_active
                    });

                if (insertError) throw insertError;
            }

            onSuccess();
        } catch (err: any) {
            console.error('Error saving program:', err);
            setError(err.message || 'Failed to save program.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">{programToEdit ? 'Edit Program' : 'Create New Program'}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form id="program-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="col-span-1 sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="name">Program Name *</label>
                                <input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    placeholder="e.g. Ramadhan Sale"
                                />
                            </div>

                            <div className="col-span-1 sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Period</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                    <span className="text-slate-500 text-sm font-medium">to</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="description">Description (Optional)</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                                    placeholder="Short description of the program"
                                />
                            </div>

                            <div className="col-span-1 sm:col-span-2 border-t border-slate-100 pt-6">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-slate-700">SKUs Applied To</label>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Total: {skus.length}</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">Add the Product SKUs that are included in this program. You can bulk paste multiple SKUs or upload a CSV file.</p>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <textarea
                                        value={skuInput}
                                        onChange={(e) => setSkuInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddSku();
                                            }
                                        }}
                                        className="block w-full sm:flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase resize-none h-10 min-h-[40px]"
                                        placeholder="Enter or paste SKUs..."
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleAddSku()}
                                            className="px-4 py-2 bg-slate-900 text-white font-medium text-sm rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0 h-10"
                                        >
                                            <Plus size={16} className="mr-1" /> Add
                                        </button>

                                        <label className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center shrink-0 h-10 cursor-pointer shadow-sm">
                                            <Upload size={16} className="mr-1.5" /> Import CSV
                                            <input
                                                type="file"
                                                accept=".csv"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {skus.length > 0 && (
                                    <div className="mt-4">
                                        <div className="flex justify-end mb-2">
                                            <button
                                                type="button"
                                                onClick={handleClearSkus}
                                                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                                            >
                                                <Trash2 size={12} /> Clear All
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-100">
                                            {skus.map((sku, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-white text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-indigo-100 shadow-sm">
                                                    {sku}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSku(index)}
                                                        className="text-indigo-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50 p-0.5"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="col-span-1 sm:col-span-2 border-t border-slate-100 pt-6 flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-slate-900 mb-1">Active Status</label>
                                    <p className="text-xs text-slate-500">If inactive, it won't be shown in the public catalogue.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border border-slate-200 bg-white text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="program-form"
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Saving...' : 'Save Program'}
                    </button>
                </div>
            </div>
        </div>
    );
};
