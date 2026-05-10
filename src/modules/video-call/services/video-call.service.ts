import { api } from '@/shared/lib/api';
import type { VideoCall, SignalingPayload } from '../types/video-call.types';

export const videoCallService = {
    initiate: async (receiverId: number): Promise<VideoCall> => {
        const response = await api.post('/video-calls/initiate', { receiver_id: receiverId });
        return response.data;
    },

    accept: async (id: string): Promise<VideoCall> => {
        const response = await api.post(`/video-calls/${id}/accept`);
        return response.data;
    },

    end: async (id: string): Promise<VideoCall> => {
        const response = await api.post(`/video-calls/${id}/end`);
        return response.data;
    },

    sendSignal: async (payload: SignalingPayload): Promise<void> => {
        await api.post('/video-calls/signal', payload);
    }
};
