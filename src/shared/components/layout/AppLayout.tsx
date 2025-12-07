import { Outlet } from 'react-router-dom';

export function AppLayout() {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 border-r bg-muted/40 p-4 hidden md:block">
                <div className="font-bold text-xl mb-6">PetMet App</div>
                <nav className="space-y-2">
                    <div className="px-2 py-1 text-sm font-medium">Dashboard</div>
                    {/* Add more sidebar items here */}
                </nav>
            </aside>
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
