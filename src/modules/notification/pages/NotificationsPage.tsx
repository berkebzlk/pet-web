import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';
import { useNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useListenForNotifications } from '../hooks/useNotifications';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';

import { useActivePet } from '@/modules/pet/context/ActivePetContext';
import { usePendingMatches } from '@/modules/match/hooks/useMatch';

export function NotificationsPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { data: user } = useAuthUser();
    const { activePet } = useActivePet();
    const { data: notifications, isLoading } = useNotifications();
    const { data: pendingMatches } = usePendingMatches(activePet?.id);
    const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
    const { mutate: markAsRead } = useMarkNotificationAsRead();

    useListenForNotifications(user?.id);

    const handleNotificationClick = (notification: any) => {
        if (!notification.read_at) {
            markAsRead(notification.id);
        }

        if (notification.type === 'match_request_sent') {
            navigate('/app/match-requests');
        } else if (notification.type === 'match_accepted') {
            navigate(`/app/profile/${notification.data.accepter_pet_username || notification.data.accepter_pet_name}`);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
                </div>
                <Button variant="ghost" size="sm" onClick={() => markAllAsRead()}>
                    {t('notifications.markAllRead')}
                </Button>
            </div>

            <div className="p-4 bg-card rounded-lg border shadow-sm mb-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/app/match-requests')}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
                            <Bell className="h-5 w-5" />
                            {pendingMatches && pendingMatches.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center border-2 border-background">
                                    {pendingMatches.length}
                                </span>
                            )}
                        </div>
                        <span className="font-medium">{t('notifications.matchRequests')}</span>
                    </div>
                    <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                </div>
            </div>

            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                ) : notifications?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">{t('notifications.empty')}</div>
                ) : (
                    notifications?.map((notification: any) => (
                        <div
                            key={notification.id}
                            className={cn(
                                "flex items-start gap-4 p-4 bg-card rounded-lg border shadow-sm cursor-pointer hover:bg-muted/50 transition-colors",
                                !notification.read_at && "border-primary/50 bg-primary/5"
                            )}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <Avatar className="h-12 w-12 border">
                                <AvatarImage src={notification.data.sender_pet_image || notification.data.accepter_pet_image} />
                                <AvatarFallback>
                                    {(notification.data.sender_pet_name || notification.data.accepter_pet_name || '?')[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {notification.data.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(notification.created_at), {
                                        addSuffix: true,
                                        locale: i18n.language === 'tr' ? tr : enUS
                                    })}
                                </p>
                            </div>
                            {!notification.read_at && (
                                <span className="h-2 w-2 rounded-full bg-primary mt-2" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
