import { create } from 'zustand';
import type { VideoCall } from '../types/video-call.types';

interface VideoCallState {
    currentCall: VideoCall | null;
    isIncoming: boolean;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isMuted: boolean;
    isVideoOff: boolean;
    
    // Actions
    setCurrentCall: (call: VideoCall | null) => void;
    setIsIncoming: (isIncoming: boolean) => void;
    setLocalStream: (stream: MediaStream | null) => void;
    setRemoteStream: (stream: MediaStream | null) => void;
    setMuted: (isMuted: boolean) => void;
    setVideoOff: (isVideoOff: boolean) => void;
    resetCall: () => void;
}

export const useVideoCallStore = create<VideoCallState>((set) => ({
    currentCall: null,
    isIncoming: false,
    localStream: null,
    remoteStream: null,
    isMuted: false,
    isVideoOff: false,

    setCurrentCall: (call) => set({ currentCall: call }),
    setIsIncoming: (isIncoming) => set({ isIncoming }),
    setLocalStream: (stream) => set({ localStream: stream }),
    setRemoteStream: (stream) => set({ remoteStream: stream }),
    setMuted: (isMuted) => set({ isMuted }),
    setVideoOff: (isVideoOff) => set({ isVideoOff }),
    resetCall: () => set({ 
        currentCall: null, 
        isIncoming: false, 
        localStream: null, 
        remoteStream: null,
        isMuted: false,
        isVideoOff: false
    }),
}));
