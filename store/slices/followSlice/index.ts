import { StateCreator } from 'zustand';
import { ResponseData, TStoreState } from '../..';
import { answerFollowRequestService, followUserService, getFollowUsersService, unfollowUserService } from '@/services';

export interface UserFollowList{
    userId: string;
    fullName: string;
    userName: string;
    profilePicture: string;
    isFollowing: boolean;
    isFollower: boolean;
    isOwner: boolean;
    isFollowRequest: boolean;
}
// State tipi
export interface TFollowState {
    followErrors? : string | null;
    followUsers: Record<string,UserFollowList[]>;
    createFollowRequest: (userId: string) => Promise<void>;
    answerFollowRequest: (requestId: string, answer: boolean) => Promise<void>;
    getFollowUsers: (isFollower:boolean,userId?: string | null, pageNumber?:number | null) => Promise<void>;
    unfollowUser: (userId: string) => Promise<void>;
    removeFollower: (userId: string) => Promise<void>;
}

const createFollowSlice: StateCreator<TStoreState, [], [], TFollowState> = (
    set,get
) => ({
    followErrors: null,
    followUsers: {},
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
    getFollowUsers: async (isFollower:boolean,userId?: string | null,pageNumber?:number | null) => {
        try {
            const response = await getFollowUsersService<ResponseData<UserFollowList>,{userId?:string | null,pageNumber:number,isFollowingList:boolean}>({
                userId,
                pageNumber: pageNumber || 1,
                isFollowingList: isFollower,
            });
            if(pageNumber === 1){
                set({ followUsers: {
                    [userId || '']: response.data.data
                } });   
            }else{
                set({ followUsers: {
                    ...get().followUsers,
                    [userId || '']: [...(get().followUsers[userId || ''] || []), ...response.data.data]
                } });
            }
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
    removeFollower: async (userId: string) => {
        try {
            await unfollowUserService({
                userId,
                isRemovingFollower: true,
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
    unfollowUser: async (userId: string) => {
        try {
            await unfollowUserService({
                userId,
                isRemovingFollower: false,
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
