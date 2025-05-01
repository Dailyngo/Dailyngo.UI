import { deletePostWithReportService, getAllReportsService, reportPostService, setReportStatusService } from "@/services";
import { ResponseData, TStoreState } from "@/store";
import { StateCreator } from "zustand";

export interface ReportData{
    id: string;
    reason: string | null;
    reportedBy: IdNameResponse;
    isProcess: boolean;
    createdAt: string;
}

export interface ReportPostData {
    id: string;
    isDeleted: boolean;
    lastReportDate : string | null;
    reportDetails: ReportData[];
}


interface IdNameResponse{
    id: string;
    name: string;
}


export interface TReportState {
    reports: ReportPostData[];
    reportLoading: boolean;
    reportError: string | null;
    
    getReports: () => Promise<void>;
    reportPost: (postId: string, reason: string|null) => Promise<boolean>;
    deletePostWithReport: (postId: string) => Promise<boolean>;
    setReportStatus: (postId: string) => Promise<boolean>;
}

const createReportSlice: StateCreator<TStoreState, [], [], TReportState> = (set, get) => ({
    reports: [],
    reportLoading: false,
    reportError: null,
    getReports: async () => {
        try {
            set({ reportError: null, reportLoading: true });
            const response = await getAllReportsService<
                ResponseData<ReportPostData>
            >();
            set({ reports: response.data.data });
        } catch (error: any) {
            set({ reportError: error.response.data.messages });
        } finally {
            set({ reportLoading: false });
            setTimeout(() => {
                set({ reportError: null });
            }, 3000);
        }
    },
    reportPost: async (postId: string, reason: string | null) => {
        try {
            set({ reportError: null, reportLoading: true });
            await reportPostService({ postId, reportReason: reason });
            set({ reportLoading: false });
            return true;
        } catch (error: any) {
            set({ reportError: error.response.data.messages, reportLoading: false });
            setTimeout(() => {
                set({ reportError: null });
            }, 3000);
            return false;
        }
    },
    deletePostWithReport: async (postId: string) => {
        try {
            set({ reportError: null, reportLoading: true });
            await deletePostWithReportService(postId);
            set({ reportLoading: false });
            return true;
        } catch (error: any) {
            set({ reportError: error.response.data.messages, reportLoading: false });
            setTimeout(() => {
                set({ reportError: null });
            }, 3000);
            return false;
        }
    },
    setReportStatus: async (postId: string) => {
        try {
            set({ reportError: null, reportLoading: true });
            await setReportStatusService(postId);
            set({ reportLoading: false });
            return true;
        } catch (error: any) {
            set({ reportError: error.response.data.messages, reportLoading: false });
            setTimeout(() => {
                set({ reportError: null });
            }, 3000);
            return false;
        }
    },
});

export default createReportSlice;