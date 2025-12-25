import { PetSwitcher } from '@/modules/pet/components/PetSwitcher';

export function MobileHeader() {
    return (
        <header className="md:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4">
                <span className="font-bold text-lg text-primary">PetMet</span>
                <div className="w-48">
                    <PetSwitcher />
                </div>
            </div>
        </header>
    );
}
