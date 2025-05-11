import { deletePostWithReportService, getAllReportsService, getStatsService, reportPostService, setReportStatusService } from "@/services";
import { ResponseData, ResponseSingleData, TStoreState } from "@/store";
import { StateCreator } from "zustand";

// public class CurrentStatisticResponse
// {
//     public long TotalPostCount { get; set; }
//     public int TotalUserCount { get; set; }
//     public int OnlineUserCount { get; set; }
// }
export interface StatisticsResponse {
    totalPostCount: number;
    totalUserCount: number;
    onlineUserCount: number;
}


export interface TStatisticsState {
    stats: StatisticsResponse;
    statsLoading: boolean;
    statsError: string | null;
    
    getStatistics: () => Promise<void>;
}

const createStatisticsSlice: StateCreator<TStoreState, [], [], TStatisticsState> = (set, get) => ({
    stats: {
        totalPostCount: 0,
        totalUserCount: 0,
        onlineUserCount: 0,
    },
    statsLoading: false,
    statsError: null,
    
    getStatistics: async () => {
        try {
            set({ statsError: null, statsLoading: true });
            const response = await getStatsService<
                ResponseSingleData<StatisticsResponse>
            >();
            set({ stats: response.data.data });
        } catch (error: any) {
            set({ statsError: error.response.data.messages });
        } finally {
            set({ statsLoading: false });
            setTimeout(() => {
                set({ statsError: null });
            }, 3000);
        }
    },
});

export default createStatisticsSlice;