import { Inbox } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function MobileHeader() {
    const navigate = useNavigate();

    return (
        <header className="md:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4">
                <span className="font-bold text-lg text-primary">PetMet</span>
                <Button variant="ghost" size="icon" onClick={() => navigate('/app/matches')}>
                    <Inbox className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
}
