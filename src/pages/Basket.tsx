import { useBasket } from '../features/catalogue/BasketContext';
import { Trash2, Plus, Minus, FileSpreadsheet, ShoppingCart, ArrowLeft, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

export const Basket = () => {
    const { items, removeFromBasket, updateQuantity, clearBasket, totalCount } = useBasket();

    const exportToExcel = () => {
        if (items.length === 0) return;

        const date = new Date().toISOString().split('T')[0];
        const fileName = `Product_Basket_${date}.xlsx`;

        const data = items.map(item => ({
            'Brand': item.brand,
            'Barcode': item.barcode,
            'SKU': item.sku,
            'Product Name': item.name,
            'Category': item.category,
            'Quantity': item.quantity
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Basket Items');

        // Set column widths
        const wscols = [
            { wch: 20 }, // Brand
            { wch: 20 }, // Barcode
            { wch: 20 }, // SKU
            { wch: 40 }, // Product Name
            { wch: 20 }, // Category
            { wch: 10 }  // Quantity
        ];
        ws['!cols'] = wscols;

        XLSX.writeFile(wb, fileName);
    };

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                    <ShoppingCart size={48} />
                </div>
                <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">Your Basket is Empty</h2>
                <p className="text-slate-500 mb-10 max-w-md mx-auto">Looks like you haven't added any products to your list yet. Browse our catalogue to get started.</p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-zinc-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-zinc-800 transition shadow-premium"
                >
                    <ArrowLeft size={20} />
                    Back to Catalogue
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-display font-black text-foreground uppercase italic tracking-wider mb-2">My Basket</h1>
                    <p className="text-slate-500 font-medium tracking-wide">Review and export your selected items ({totalCount} total units).</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={clearBasket}
                        className="flex items-center gap-2 px-6 py-4 border border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-sm"
                    >
                        <Trash size={18} />
                        Clear All
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-premium text-sm"
                    >
                        <FileSpreadsheet size={18} />
                        Export to Excel
                    </button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-surface rounded-3xl border border-border overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-border">
                            <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Product Details</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-[0.2em] text-center">SKU / Brand</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-[0.2em] text-center">Quantity</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-[0.2em] text-right pr-10">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {items.map((item) => (
                            <tr key={item.sku} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-6 py-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{item.name}</span>
                                        <span className="text-xs font-mono text-slate-400">Barcode: {item.barcode || '-'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded mb-1">{item.sku}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.brand || 'BNS'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                            <button
                                                onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                                                className="p-1 px-3 hover:bg-slate-100 text-slate-500 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <div className="w-10 text-center font-bold text-sm tabular-nums">
                                                {item.quantity}
                                            </div>
                                            <button
                                                onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                                                className="p-1 px-3 hover:bg-slate-100 text-slate-500 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-right pr-10">
                                    <button
                                        onClick={() => removeFromBasket(item.sku)}
                                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {items.map((item) => (
                    <div key={item.sku} className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1 pr-8">
                                <h3 className="font-bold text-slate-900 leading-tight">{item.name}</h3>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded tracking-wide uppercase">{item.sku}</span>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{item.brand}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromBasket(item.sku)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</span>
                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                                <button
                                    onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                                    className="p-2 px-4 hover:bg-slate-50 text-slate-500 transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <div className="w-12 text-center font-bold tabular-nums">
                                    {item.quantity}
                                </div>
                                <button
                                    onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                                    className="p-2 px-4 hover:bg-slate-50 text-slate-500 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center pt-8 border-t border-border">
                <p className="text-slate-400 text-sm italic">Note: Your basket is saved locally in this browser and will not be shared with anyone until you export it.</p>
            </div>
        </div>
    );
};
