import { useParams, useNavigate } from 'react-router-dom';
import { useActivePet } from '@/shared/hooks/useActivePet';
import { useTranslation } from 'react-i18next';
import { ChatWindow } from '../components/ChatWindow';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { petService } from '@/modules/pet/services/pet.service';
import type { Pet } from '@/modules/pet/types/pet.types';

import { Video } from 'lucide-react';
import { videoCallService } from '@/modules/video-call/services/video-call.service';
import { useVideoCallStore } from '@/modules/video-call/hooks/useVideoCallStore';
import { toast } from 'sonner';

export function ChatPage() {
    const { petId: otherPetIdStr } = useParams<{ petId: string }>();
    const navigate = useNavigate();
    const { activePetId } = useActivePet();
    const { t } = useTranslation();
    const [otherPet, setOtherPet] = useState<Pet | null>(null);
    const { setCurrentCall } = useVideoCallStore();

    const otherPetId = Number(otherPetIdStr);

    useEffect(() => {
        if (!otherPetId) return;
        petService.getById(otherPetId).then(res => setOtherPet(res.data)).catch(() => navigate(-1));
    }, [otherPetId, navigate]);

    const handleStartCall = async () => {
        if (!otherPet?.user?.id) return;
        
        try {
            const call = await videoCallService.initiate(otherPet.user.id);
            setCurrentCall(call);
            toast.success(t('videoCall.starting'));
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('videoCall.errorStarting'));
        }
    };

    if (!activePetId) return <div>{t('match.selectPetFirst')}</div>;
    if (!otherPet) return <div>{t('common.loading')}</div>;

    return (
        <div className="container max-w-2xl py-4 space-y-4">
            <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
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
                </div>
                
                <Button variant="ghost" size="icon" onClick={handleStartCall} className="text-primary">
                    <Video className="h-6 w-6" />
                </Button>
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
