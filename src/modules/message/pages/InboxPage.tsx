import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useActivePet } from '@/modules/pet/context/ActivePetContext';
import { useConversations } from '../hooks/useConversations';
import { Loader2, MessageCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Card } from '@/shared/components/ui/card';

export function InboxPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { activePet } = useActivePet();
    const { data: conversations = [], isLoading } = useConversations(activePet?.id);

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{t('message.inbox')}</h1>
            </header>

            <div className="space-y-2">
                {conversations.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>{t('message.noConversations')}</p>
                    </div>
                ) : (
                    conversations.map((msg) => {
                        // Determine the other party
                        const isSenderMe = msg.sender_pet_id === activePet?.id;
                        const otherPet = isSenderMe ? msg.receiver : msg.sender;
                        const isUnread = !isSenderMe && !msg.read_at;

                        // Safety check if relation is missing
                        if (!otherPet) return null;

                        return (
                            <Card
                                key={msg.id}
                                className={cn(
                                    "p-4 cursor-pointer transition-colors hover:bg-muted/50",
                                    isUnread && "bg-muted border-l-4 border-l-primary"
                                )}
                                onClick={() => navigate(`/app/messages/${otherPet.id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border">
                                        <AvatarImage src={otherPet.image || undefined} className="object-cover" />
                                        <AvatarFallback>{otherPet.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className={cn("truncate", isUnread ? "font-bold" : "font-semibold")}>
                                                {otherPet.name}
                                            </h3>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {format(new Date(msg.created_at), 'MMM d, HH:mm')}
                                            </span>
                                        </div>
                                        <p className={cn("text-sm truncate", isUnread ? "text-foreground font-medium" : "text-muted-foreground")}>
                                            {isSenderMe && <span className="font-medium text-primary">{t('message.you')}: </span>}
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
