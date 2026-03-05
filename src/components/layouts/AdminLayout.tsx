import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, LogOut, Settings, Tag } from 'lucide-react'

export const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-muted/30 flex">
            {/* Sidebar sidebar */}
            <aside className="w-64 bg-surface border-r border-border hidden md:flex flex-col">
                <div className="p-6">
                    <h2 className="font-bold text-lg tracking-tight">Admin System</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">BNS Hype</p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`
                        }
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`
                        }
                    >
                        <Package size={18} />
                        Products
                    </NavLink>

                    <NavLink
                        to="/admin/programs"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`
                        }
                    >
                        <Tag size={18} />
                        Programs
                    </NavLink>

                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`
                        }
                    >
                        <Settings size={18} />
                        Settings
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-border">
                    <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Mobile Header (Hidden on Desktop) */}
                <header className="md:hidden bg-surface border-b border-border p-4 flex items-center justify-between">
                    <h2 className="font-bold tracking-tight">Admin System</h2>
                    <button className="text-muted-foreground"><LayoutDashboard size={20} /></button>
                </header>

                <div className="flex-1 overflow-auto p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
