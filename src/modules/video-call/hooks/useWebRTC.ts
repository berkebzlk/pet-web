import { useCallback, useEffect, useRef } from 'react';
import { useVideoCallStore } from './useVideoCallStore';
import { videoCallService } from '../services/video-call.service';
import { useAuthUser } from '@/modules/auth/hooks/useAuth';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

export const useWebRTC = () => {
    const { data: user } = useAuthUser();
    const { 
        currentCall, 
        setLocalStream, 
        setRemoteStream, 
        localStream, 
        isMuted,
        isVideoOff,
        setMuted,
        setVideoOff,
        resetCall 
    } = useVideoCallStore();
    
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const currentCallRef = useRef(currentCall);
    const userRef = useRef(user);

    useEffect(() => { currentCallRef.current = currentCall; }, [currentCall]);
    useEffect(() => { userRef.current = user; }, [user]);
    useEffect(() => { localStreamRef.current = localStream; }, [localStream]);

    // Apply mute/video off states whenever localStream changes
    useEffect(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            const videoTrack = localStream.getVideoTracks()[0];
            if (audioTrack) audioTrack.enabled = !isMuted;
            if (videoTrack) videoTrack.enabled = !isVideoOff;
        }
    }, [localStream, isMuted, isVideoOff]);

    const cleanup = useCallback(() => {
        if (peerConnection.current) {
            console.log('Cleaning up PeerConnection');
            peerConnection.current.close();
            peerConnection.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        resetCall();
    }, [resetCall]);

    const initPeerConnection = useCallback(async () => {
        if (peerConnection.current) return peerConnection.current;

        console.log('Initializing New PeerConnection');
        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate && currentCallRef.current) {
                const targetId = (Number(currentCallRef.current.caller_id) === Number(userRef.current?.id))
                    ? Number(currentCallRef.current.receiver_id) 
                    : Number(currentCallRef.current.caller_id);
                
                console.log('Sending ICE Candidate to:', targetId);
                videoCallService.sendSignal({
                    call_id: currentCallRef.current.id,
                    receiver_id: targetId,
                    signal_data: event.candidate.toJSON(),
                    type: 'ice-candidate'
                });
            }
        };

        pc.ontrack = (event) => {
            console.log('Remote track received:', event.streams[0]);
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log('ICE Connection State:', pc.iceConnectionState);
            if (pc.iceConnectionState === 'failed') {
                cleanup();
            }
        };

        peerConnection.current = pc;
        return pc;
    }, [setRemoteStream, cleanup]);

    const startLocalStream = useCallback(async () => {
        try {
            if (localStreamRef.current) return localStreamRef.current;
            console.log('Starting Local Stream');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    }, [setLocalStream]);

    const handleOffer = useCallback(async (offerData: { type: string, sdp: string }, senderId: number) => {
        console.log('Handling Offer from:', senderId);
        const pc = await initPeerConnection();
        const stream = await startLocalStream();
        
        pc.getSenders().forEach(sender => pc.removeTrack(sender));
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
        
        try {
            // Decode SDP from Base64
            const decodedSdp = atob(offerData.sdp);
            await pc.setRemoteDescription(new RTCSessionDescription({
                type: offerData.type as RTCSdpType,
                sdp: decodedSdp
            }));
            
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            if (currentCallRef.current) {
                await videoCallService.sendSignal({
                    call_id: currentCallRef.current.id,
                    receiver_id: senderId,
                    signal_data: { type: answer.type, sdp: btoa(answer.sdp || '') }, // Encode to Base64
                    type: 'answer'
                });
            }
        } catch (error) {
            console.error('Error in handleOffer:', error);
        }
    }, [initPeerConnection, startLocalStream]);

    const handleAnswer = useCallback(async (answerData: { type: string, sdp: string }) => {
        if (peerConnection.current) {
            console.log('Handling Answer');
            try {
                const decodedSdp = atob(answerData.sdp);
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription({
                    type: answerData.type as RTCSdpType,
                    sdp: decodedSdp
                }));
            } catch (error) {
                console.error('Error in handleAnswer:', error);
            }
        }
    }, []);

    const handleCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
        if (peerConnection.current) {
            console.log('Adding Remote ICE Candidate');
            try {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.warn('Error adding ICE candidate', e);
            }
        }
    }, []);

    const createOffer = useCallback(async (receiverId: number) => {
        console.log('Creating Offer for:', receiverId);
        const pc = await initPeerConnection();
        const stream = await startLocalStream();
        
        pc.getSenders().forEach(sender => pc.removeTrack(sender));
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        if (currentCallRef.current) {
            await videoCallService.sendSignal({
                call_id: currentCallRef.current.id,
                receiver_id: receiverId,
                signal_data: { type: offer.type, sdp: btoa(offer.sdp || '') }, // Encode to Base64
                type: 'offer'
            });
        }
    }, [initPeerConnection, startLocalStream]);

    const toggleMic = useCallback(() => {
        const newState = !isMuted;
        setMuted(newState);
        return newState;
    }, [isMuted, setMuted]);

    const toggleVideo = useCallback(() => {
        const newState = !isVideoOff;
        setVideoOff(newState);
        return newState;
    }, [isVideoOff, setVideoOff]);

    return {
        createOffer,
        handleOffer,
        handleAnswer,
        handleCandidate,
        startLocalStream,
        toggleMic,
        toggleVideo,
        cleanup,
        peerConnection: peerConnection.current
    };
};
