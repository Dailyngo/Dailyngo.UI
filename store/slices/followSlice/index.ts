import { StateCreator } from 'zustand';
import { ResponseData, TStoreState } from '../..';
import { answerFollowRequestService, followUserService } from '@/services';

// State tipi
export interface TFollowState {
    followErrors? : string | null;

    createFollowRequest: (userId: string) => Promise<void>;
    answerFollowRequest: (requestId: string, answer: boolean) => Promise<void>;
}

const createFollowSlice: StateCreator<TStoreState, [], [], TFollowState> = (
    set,get
) => ({
    followErrors: null,
    createFollowRequest: async (userId: string) => {
        try {
            await followUserService<ResponseData<any>,{receiverId:string}>({
                receiverId: userId,
            });
            set({ followErrors: null });
        } catch (error : any) {
            console.error("Follow request error:", error);
            set({ followErrors: error.response.data.messages });
        } finally{
            setInterval(() => {
                set((state: TFollowState) => ({
                    ...state,
                    followErrors: null
                }));
            }
            , 3000);
        }
    },
    answerFollowRequest: async (requestId: string, answer: boolean) => {
        try {
            await answerFollowRequestService<ResponseData<any>,{requestId:string, isAccepted:boolean}>({
                requestId,
                isAccepted: answer,
            });
            set({ followErrors: null });
        } catch (error : any) {
            set({ followErrors: error.response.data.messages });
        } finally{
            setInterval(() => {
                set((state: TFollowState) => ({
                    ...state,
                    followErrors: null
                }));
            }
            , 3000);
        }
    },
});

export default createFollowSlice;
