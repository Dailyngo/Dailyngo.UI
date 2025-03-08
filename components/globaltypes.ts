export enum AppNotificationType {
  FriendRequest = 0,
}

export type AppNotification = {
  type: AppNotificationType;
  title: string;
  avatarColor?: string;
  avatarText?: string;
  friendId?: string;
};
