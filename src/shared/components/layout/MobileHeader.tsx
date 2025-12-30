import { Bell } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { CreatePostModal } from "../../../modules/post/components/CreatePostModal";

export function MobileHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
                <div className="flex flex-1 items-center justify-between">
                    <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {import.meta.env.VITE_APP_NAME || 'PetMet'}
                    </span>
                    <div className="flex items-center gap-2">
                        <CreatePostModal />
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
