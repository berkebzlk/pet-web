import { MessageCircle, Bell } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { CreatePostModal } from "../../../modules/post/components/CreatePostModal";
import { useNavigate } from 'react-router-dom';
import { useUnreadNotificationCount } from '@/modules/notification/hooks/useNotifications';

import { useActivePet } from '@/modules/pet/context/ActivePetContext';
import { usePendingMatches } from '@/modules/match/hooks/useMatch';

export function MobileHeader() {
    const navigate = useNavigate();
    const { activePet } = useActivePet();
    const { data: unreadCount } = useUnreadNotificationCount();
    const { data: pendingMatches } = usePendingMatches(activePet?.id);

    const hasNotifications = (unreadCount > 0) || (pendingMatches && pendingMatches.length > 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
                <div className="flex flex-1 items-center justify-between">
                    <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {import.meta.env.VITE_APP_NAME || 'PetMet'}
                    </span>
                    <div className="flex items-center gap-2">
                        <CreatePostModal />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            onClick={() => navigate('/app/notifications')}
                        >
                            <Bell className="h-5 w-5" />
                            {hasNotifications && (
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                            )}
                        </Button>
                        <Button variant="ghost" size="icon" className="relative">
                            <MessageCircle className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
