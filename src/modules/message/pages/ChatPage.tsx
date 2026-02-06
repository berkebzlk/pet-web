import { useParams, useNavigate } from 'react-router-dom';
import { useActivePet } from '@/shared/hooks/useActivePet';
import { useTranslation } from 'react-i18next';
import { ChatWindow } from '../components/ChatWindow';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { petService } from '@/modules/pet/services/pet.service';
import type { Pet } from '@/modules/pet/types/pet.types';

export function ChatPage() {
    const { petId: otherPetIdStr } = useParams<{ petId: string }>();
    const navigate = useNavigate();
    const { activePetId } = useActivePet();
    const { t } = useTranslation();
    const [otherPet, setOtherPet] = useState<Pet | null>(null);

    const otherPetId = Number(otherPetIdStr);

    useEffect(() => {
        if (!otherPetId) return;
        petService.getById(otherPetId).then(res => setOtherPet(res.data)).catch(() => navigate(-1));
    }, [otherPetId, navigate]);

    if (!activePetId) return <div>{t('match.selectPetFirst')}</div>;
    if (!otherPet) return <div>{t('common.loading')}</div>;

    return (
        <div className="container max-w-2xl py-4 space-y-4">
            <header className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div className="flex items-center gap-3">
                    <img
                        src={otherPet.image || "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop"}
                        alt={otherPet.name}
                        className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                        <h1 className="font-bold text-lg leading-none">{otherPet.name}</h1>
                        <p className="text-xs text-muted-foreground">@{otherPet.username}</p>
                    </div>
                </div>
            </header>

            <ChatWindow
                currentPetId={activePetId}
                otherPetId={otherPetId}
                otherPetName={otherPet.name}
                otherPetImage={otherPet.image || ""}
            />
        </div>
    );
}
