import { deletePostWithReportService, getAllReportsService, reportPostService, setReportStatusService } from "@/services";
import { ResponseData, TStoreState } from "@/store";
import { StateCreator } from "zustand";

export interface ReportData{
    id: string;
    postId: string;
    reason: string | null;
    reportedBy: IdNameResponse;
    isProcess: boolean;
    createdAt: string;
}

interface IdNameResponse{
    id: string;
    name: string;
}


export interface TReportState {
    reports: ReportData[];
    reportLoading: boolean;
    reportError: string | null;
    
    getReports: (status : boolean) => Promise<void>;
    reportPost: (postId: string, reason: string|null) => Promise<boolean>;
    deletePostWithReport: (postId: string) => Promise<boolean>;
    setReportStatus: (reportId: string) => Promise<boolean>;
}

const createReportSlice: StateCreator<TStoreState, [], [], TReportState> = (set, get) => ({
    reports: [],
    reportLoading: false,
    reportError: null,
    getReports: async (status : boolean) => {
        try {
            set({ reportError: null, reportLoading: true });
            const response = await getAllReportsService<
                ResponseData<ReportData>,
                {isProcess: boolean}
            >({ isProcess: status });
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
            set({ reportError: error.response.data.messages });
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
            set({ reportError: error.response.data.messages });
            setTimeout(() => {
                set({ reportError: null });
            }, 3000);
            return false;
        }
    },
    setReportStatus: async (reportId: string) => {
        try {
            set({ reportError: null, reportLoading: true });
            await setReportStatusService(reportId);
            set({ reportLoading: false });
            return true;
        } catch (error: any) {
            set({ reportError: error.response.data.messages });
            setTimeout(() => {
                set({ reportError: null });
            }, 3000);
            return false;
        }
    },
});

export default createReportSlice;