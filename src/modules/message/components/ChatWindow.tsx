import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { useMessages, useSendMessage } from '../hooks/useMessages';
import { useMarkMessagesAsRead } from '../hooks/useUnreadMessageCount';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';

interface ChatWindowProps {
    currentPetId: number;
    otherPetId: number;
    otherPetName: string;
    otherPetImage: string;
}

export function ChatWindow({ currentPetId, otherPetId, otherPetName, otherPetImage }: ChatWindowProps) {
    const { t } = useTranslation();
    const [content, setContent] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: messages = [], isLoading } = useMessages(currentPetId, otherPetId);
    const sendMessage = useSendMessage();
    const markAsRead = useMarkMessagesAsRead();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        // Mark as read when messages are loaded/updated
        if (messages.length > 0) {
            markAsRead.mutate({ petId: currentPetId, otherPetId });
        }
    }, [messages, currentPetId, otherPetId]);

    const handleSend = () => {
        if (!content.trim()) return;

        sendMessage.mutate({
            petId: currentPetId,
            payload: { receiver_pet_id: otherPetId, content: content.trim() }
        }, {
            onSuccess: () => {
                setContent('');
            }
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;
    }

    // Invert messages if they are returned newest first, but typically for chat we want oldest at top.
    // The query returns ordered by created_at desc. So we should reverse them for display.
    const sortedMessages = [...messages].reverse();

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {sortedMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                        <p>{t('message.noMessages')}</p>
                    </div>
                ) : (
                    sortedMessages.map((msg) => {
                        const isMe = msg.sender_pet_id === currentPetId;
                        return (
                            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                {!isMe && (
                                    <img src={otherPetImage} alt={otherPetName} className="w-8 h-8 rounded-full mr-2 self-end" />
                                )}
                                <div className={cn(
                                    "max-w-[70%] rounded-lg px-4 py-2 text-sm",
                                    isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                                )}>
                                    <p>{msg.content}</p>
                                    <p className="text-[10px] opacity-70 mt-1 text-right">
                                        {format(new Date(msg.created_at), 'HH:mm')}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={scrollRef} />
            </div>

            <div className="p-3 border-t bg-background flex gap-2">
                <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('message.placeholder')}
                    className="flex-1"
                    disabled={sendMessage.isPending}
                />
                <Button onClick={handleSend} disabled={!content.trim() || sendMessage.isPending} size="icon">
                    {sendMessage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    );
}
