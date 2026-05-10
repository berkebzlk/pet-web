import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { ActivePetProvider } from '@/modules/pet/context/ActivePetContext';

import { MobileHeader } from './MobileHeader';
import { useMessageListener } from '@/modules/message/hooks/useMessageListener';
import { useMatchNotifications } from '@/modules/match/hooks/useMatchNotifications';

import { useVideoCallListener } from '@/modules/video-call/hooks/useVideoCallListener';
import { CallOverlay } from '@/modules/video-call/components/CallOverlay';

function AppLayoutContent() {
    useMessageListener();
    useMatchNotifications();
    useVideoCallListener();

    return (
        <div className="flex min-h-screen bg-background">
            <CallOverlay />
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 md:pl-64 flex flex-col">
                <MobileHeader />
                <div className="container mx-auto p-4 pb-24 md:pb-8 md:p-8 max-w-2xl md:max-w-5xl flex-1">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <BottomNav />
        </div>
    );
}

export function AppLayout() {
    return (
        <ActivePetProvider>
            <AppLayoutContent />
        </ActivePetProvider>
    );
}
