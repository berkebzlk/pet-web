import React, { useEffect, useRef } from 'react';
import { useVideoCallStore } from '../hooks/useVideoCallStore';
import { useWebRTC } from '../hooks/useWebRTC';
import { videoCallService } from '../services/video-call.service';
import { Button } from '@/shared/components/ui/button';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';

export const CallOverlay = () => {
    const { 
        currentCall, 
        isIncoming, 
        setIsIncoming,
        localStream, 
        remoteStream, 
        isMuted,
        isVideoOff,
        resetCall 
    } = useVideoCallStore();
    
    const { 
        createOffer, 
        handleOffer, 
        cleanup, 
        startLocalStream,
        toggleMic,
        toggleVideo 
    } = useWebRTC();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // Toggle Handlers
    const handleToggleMic = () => {
        toggleMic();
    };

    const handleToggleVideo = () => {
        toggleVideo();
    };

    const handleEnd = async () => {
        if (!currentCall) return;
        try {
            await videoCallService.end(currentCall.id);
            cleanup();
        } catch (error) {
            console.error('Error ending call:', error);
            cleanup(); // Cleanup anyway
        }
    };

    const handleAccept = async () => {
        if (!currentCall) return;
        try {
            setIsIncoming(false); // Update UI state immediately
            await videoCallService.accept(currentCall.id);
            // Stream is already started by the useEffect below
            toast.success('Connecting...');
        } catch (error) {
            toast.error('Failed to accept call');
            cleanup();
        }
    };

    const handleReject = async () => {
        handleEnd();
    };

    // Auto-end call after 30 seconds if not accepted
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        
        if (currentCall && !remoteStream) {
            timeout = setTimeout(() => {
                toast.info('No answer');
                handleEnd();
            }, 30000);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [currentCall, remoteStream, handleEnd]);

    // Start local stream immediately for everyone to allow preview/toggles
    useEffect(() => {
        if (!localStream && currentCall) {
            startLocalStream().catch(err => console.error('Failed to start media:', err));
        }
    }, [localStream, startLocalStream, currentCall]);

    // Attach streams to video elements
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    if (!currentCall) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans">
            {/* Remote Video (Full Screen) */}
            <div className="absolute inset-0 w-full h-full bg-slate-900">
                {remoteStream ? (
                    <video 
                        ref={remoteVideoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-4">
                        <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse border border-indigo-500/30">
                            <Phone className="w-10 h-10 text-indigo-400" />
                        </div>
                        <div className="text-xl font-medium tracking-wide">
                            {isIncoming ? 'Incoming Call...' : 'Waiting for connection...'}
                        </div>
                    </div>
                )}
            </div>

            {/* Local Video (Floating/Preview) */}
            <div className={cn(
                "absolute transition-all duration-500 ease-in-out border-2 border-white/20 rounded-2xl overflow-hidden bg-slate-800 shadow-2xl z-10",
                remoteStream 
                    ? "top-8 right-8 w-48 h-64 md:w-64 md:h-80" 
                    : "w-full h-full border-none rounded-none"
            )}>
                {localStream ? (
                    <video 
                        ref={localVideoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 italic bg-slate-900">
                        Camera Starting...
                    </div>
                )}
                {/* Overlay when video is off */}
                {isVideoOff && (
                    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                            <VideoOff className="w-8 h-8 text-white/50" />
                        </div>
                    </div>
                )}
            </div>

            {/* Call Controls */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
                {/* Always show mic/video toggles if localStream exists */}
                {localStream && (
                    <>
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className={cn("w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border-none hover:bg-white/20", isMuted && "bg-red-500 hover:bg-red-600")}
                            onClick={handleToggleMic}
                        >
                            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                        </Button>
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className={cn("w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border-none hover:bg-white/20", isVideoOff && "bg-red-500 hover:bg-red-600")}
                            onClick={handleToggleVideo}
                        >
                            {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
                        </Button>
                    </>
                )}

                {isIncoming ? (
                    <div className="flex items-center gap-8">
                        <Button 
                            variant="destructive" 
                            size="icon" 
                            className="w-16 h-16 rounded-full animate-pulse shadow-lg shadow-red-500/20"
                            onClick={handleReject}
                        >
                            <PhoneOff className="w-8 h-8 text-white" />
                        </Button>
                        <Button 
                            variant="default" 
                            size="icon" 
                            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 animate-bounce shadow-lg shadow-green-500/20"
                            onClick={handleAccept}
                        >
                            <Phone className="w-8 h-8 text-white" />
                        </Button>
                    </div>
                ) : (
                    <Button 
                        variant="destructive" 
                        size="icon" 
                        className="w-16 h-16 rounded-full shadow-lg shadow-red-500/20"
                        onClick={handleEnd}
                    >
                        <PhoneOff className="w-8 h-8 text-white" />
                    </Button>
                )}
            </div>
        </div>
    );
};
