import { useEffect, useRef } from 'react';
import { echo } from '@/shared/lib/echo';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';
import { useVideoCallStore } from './useVideoCallStore';
import { useWebRTC } from './useWebRTC';
import { toast } from 'sonner';

export const useVideoCallListener = () => {
    const { data: user } = useAuthUser();
    const { setCurrentCall, setIsIncoming, currentCall, resetCall } = useVideoCallStore();
    const { handleOffer, handleAnswer, handleCandidate, cleanup, createOffer } = useWebRTC();
    
    // Stable refs for handlers to prevent useEffect re-runs
    const handlersRef = useRef({ handleOffer, handleAnswer, handleCandidate, cleanup, createOffer });
    useEffect(() => {
        handlersRef.current = { handleOffer, handleAnswer, handleCandidate, cleanup, createOffer };
    }, [handleOffer, handleAnswer, handleCandidate, cleanup, createOffer]);

    const currentCallRef = useRef(currentCall);
    useEffect(() => {
        currentCallRef.current = currentCall;
    }, [currentCall]);

    const userRef = useRef(user);
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const channel = echo.private(`user.${user.id}`);

        channel.listen('.video.call.initiated', (data: any) => {
            setCurrentCall(data.call);
            setIsIncoming(true);
            toast.info(`Incoming video call from ${data.caller.name}`, { duration: 10000 });
        });

        channel.listen('.video.call.accepted', (data: any) => {
            setCurrentCall(data.call);
            setIsIncoming(false);
            
            if (Number(data.call.caller_id) === Number(userRef.current?.id)) {
                console.log('Call accepted, initiating WebRTC offer in 500ms...');
                setTimeout(() => {
                    handlersRef.current.createOffer(data.call.receiver_id);
                }, 500);
            }
        });

        channel.listen('.video.call.ended', (data: any) => {
            handlersRef.current.cleanup();
            toast.info('Call ended');
        });

        channel.listen('.video.webrtc.signal', (data: any) => {
            console.log('--- WebRTC Signal Received ---', data.type, data);
            
            if (!currentCallRef.current) {
                console.warn('Signal received but currentCall is null');
                return;
            }

            if (currentCallRef.current.id !== data.callId) {
                console.warn('Signal callId mismatch:', currentCallRef.current.id, data.callId);
                return;
            }

            switch (data.type) {
                case 'offer':
                    handlersRef.current.handleOffer(data.signalData, data.senderId);
                    break;
                case 'answer':
                    handlersRef.current.handleAnswer(data.signalData);
                    break;
                case 'ice-candidate':
                    handlersRef.current.handleCandidate(data.signalData);
                    break;
            }
        });

        return () => {
            channel.stopListening('.video.call.initiated');
            channel.stopListening('.video.call.accepted');
            channel.stopListening('.video.call.ended');
            channel.stopListening('.video.webrtc.signal');
        };
    }, [user, setCurrentCall, setIsIncoming]); // Only depend on identity and store setters
};
