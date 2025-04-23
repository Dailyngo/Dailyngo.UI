import { StateCreator } from 'zustand';
import { ResponseData, ResponseSingleData, TStoreState } from '../..';
import { getAllNotificationsService, getTodayBirthdaysService, getUserProfileCardService, searchUsersService } from '@/services';

// return new BaseNotificationDto
//  {
//      SenderId = senderId,
//      SenderName = senderName,
//      RelatedEntityId = n.Type == NotificationType.Comment
//          ? comments.FirstOrDefault(c => c.Id == ObjectId.Parse(n.RelatedEntityId))?.PostId.ToString()
//          : n.RelatedEntityId,
//      Text = n.Type == NotificationType.Comment
//          ? FormatComment(comments.FirstOrDefault(c => c.Id == ObjectId.Parse(n.RelatedEntityId)))
//          : null,
//      NotificationType = n.Type,
//      CreatedAt = n.CreatedAt.Value
//  };


export interface Notification {
    followRequests: FollowNotification[],
    otherNotifications: OtherNotification[]
    // announcements: []
}

// Response tipi
export interface FollowNotification{
    senderId: string,
    senderName: string,
    relatedEntityId: string,
    createdAt: string
}

export interface OtherNotification {
    senderId: string,
    senderName: string,
    relatedEntityId: string,
    text: string,
    notificationType: number,
    createdAt: string
}

// State tipi
export interface TNotificationState {
  notification: Notification;

  // Actions
  getAllNotifications: () => Promise<void>;
}

const createNotificationSlice: StateCreator<TStoreState, [], [], TNotificationState> = (
    set,get
) => ({
    notification: {
        followRequests: [],
        otherNotifications: [],
        // announcements: [],
    },
    getAllNotifications: async () => {
        try {
            const response = await getAllNotificationsService<ResponseSingleData<Notification>>();
            set({ notification: response.data.data });
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    },
    resetBirthdayError: () => {
        set({ error: null });
    },
});

export default createNotificationSlice;
