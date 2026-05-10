import { useEffect } from 'react';
import { echo } from '@/shared/lib/echo';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';
import { useVideoCallStore } from './useVideoCallStore';
import { toast } from 'sonner';

export const useVideoCallListener = () => {
    const { data: user } = useAuthUser();
    const { setCurrentCall, setIsIncoming, currentCall, resetCall } = useVideoCallStore();

    useEffect(() => {
        if (!user) return;

        const channel = echo.private(`user.${user.id}`);

        channel.listen('.video.call.initiated', (data: any) => {
            console.log('Incoming call:', data);
            // If already in a call, we should probably signal "busy" (Phase 5)
            // For now, just set it
            setCurrentCall(data.call);
            setIsIncoming(true);
            
            toast.info(`Incoming video call from ${data.caller.name}`, {
                duration: 10000,
                // We'll add accept/reject buttons in Phase 4
            });
        });

        channel.listen('.video.call.accepted', (data: any) => {
            console.log('Call accepted:', data);
            setCurrentCall(data.call);
            setIsIncoming(false);
        });

        channel.listen('.video.call.ended', (data: any) => {
            console.log('Call ended:', data);
            resetCall();
            toast.info('Call ended');
        });

        // This will be used in Phase 3 for WebRTC handshake
        channel.listen('.video.webrtc.signal', (data: any) => {
            console.log('WebRTC Signal received:', data.type);
            // We'll emit an event or use another store property to trigger handshake logic
        });

        return () => {
            channel.stopListening('.video.call.initiated');
            channel.stopListening('.video.call.accepted');
            channel.stopListening('.video.call.ended');
            channel.stopListening('.video.webrtc.signal');
        };
    }, [user, setCurrentCall, setIsIncoming, resetCall]);
};
