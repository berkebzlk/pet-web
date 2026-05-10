export type CallStatus = 'pending' | 'accepted' | 'rejected' | 'ended' | 'busy' | 'no_answer';

export interface VideoCall {
    id: string;
    caller_id: number;
    receiver_id: number;
    status: CallStatus;
    room_name: string;
    started_at?: string;
    ended_at?: string;
    created_at: string;
}

export interface SignalingPayload {
    call_id: string;
    receiver_id: number;
    signal_data: any;
    type: 'offer' | 'answer' | 'ice-candidate';
}
