import React, { use, useEffect, useState } from 'react';
import { Menu, Button, Card } from 'antd';
import { Icon } from '@iconify/react';
import moment from 'moment';
import { useStore } from '@/store';
import { useRouter } from 'next/navigation';
import { FollowNotification, OtherNotification } from '@/store/slices/notification';

const NotificationDetails = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'followRequests'>('all');

  const {
		notification,
		answerFollowRequest,
		getAllNotifications,
		followErrors,
  } = useStore();
    const router = useRouter();
  const renderIcon = (notificationType: number) => {
    switch(notificationType) {
      case 0: // Like
        return <Icon icon="mdi:heart" width="24" className="text-red-500" />;
      case 1: // Comment
        return <Icon icon="mdi:comment-text" width="24" className="text-green-500" />;
      default:
        return <Icon icon="mdi:bell" width="24" className="text-blue-500" />;
    }
  };

  const truncateMessage = (message: string, maxLength: number) => {
    return message.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
  };

  const getNotificationMessage = (notif: OtherNotification) => {
    switch (notif.notificationType) {
      case 0:
        return truncateMessage(`${notif.senderName} gönderinizi beğendi`, 75);
      case 1:
        return truncateMessage(`${notif.senderName} gönderinize yorum yaptı: ${notif.text}`, 60);
      default:
        return truncateMessage(`${notif.senderName} yeni bir bildirim gönderdi`, 75);
    }
  }

  const renderOtherNotification = (notif: OtherNotification) => {
    return (
      <Card
        className="w-full shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => {
          if (notif.relatedEntityId) {
            router.push(`/posts/${notif.relatedEntityId}`);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-shrink-0">
              {renderIcon(notif.notificationType)}
            </div>

            <div className="flex flex-col justify-center flex-grow">
              <p
                className="text-sm font-medium text-gray-800 leading-tight break-words"
              >
                {getNotificationMessage(notif)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {moment(notif.createdAt).format('DD MMM HH:mm')}
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  };
  

  const getAllNotificationsHandler = async () => {
    await getAllNotifications();  
  };

  useEffect(() => {
		getAllNotificationsHandler();
  }, []);

  const followRequestHandler = async (isAccept: boolean, receiverId:string) => {
		if (!receiverId) return;
		await answerFollowRequest(receiverId, isAccept);
    if(!followErrors){
      await getAllNotificationsHandler();
    }
	};

  const renderFollowRequestNotification = (notif: FollowNotification) => {
    return (
      <Card
        className="w-full shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Icon icon="mdi:account-plus" width="24" className="text-blue-500" />
            </div>

            <div className="flex flex-col justify-center cursor-pointer"
              onClick={() => {router.push(`/users/${notif.senderId}`)}}
            >
              <p className="text-sm font-medium text-gray-800 leading-tight">
                {notif.senderName} takip isteği gönderdi
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {moment(notif.createdAt).format('DD MMM HH:mm')}
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              type="primary"
              className="bg-black hover:bg-gray-800 border-none text-white"
              onClick={async () => {
                await followRequestHandler(true,notif.relatedEntityId);
              }}
            >
              Onayla
            </Button>
            <Button
              type="default"
              className="bg-white hover:bg-gray-100 border border-gray-300 text-black"
              onClick={async () => {
                await followRequestHandler(false,notif.relatedEntityId);
              }}
            >
              Reddet
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const renderContent = () => {
    return (
      <div className="flex flex-col gap-3">
        {activeTab === 'all' 
          ? notification.otherNotifications.length > 0
            ? notification.otherNotifications.map((notif, index) => (
                <div key={`${index}-${notif.relatedEntityId}`}>
                  {renderOtherNotification(notif)}
                </div>
              ))
            : <div className="text-center text-gray-500 py-8">
                Bildirim yok
              </div>
          : notification.followRequests.length > 0
            ? notification.followRequests.map((notif, index) => (
                <div key={`${index}-${notif.relatedEntityId}`}>
                  {renderFollowRequestNotification(notif)}
                </div>
              ))
            : <div className="text-center text-gray-500 py-8">
                Takip isteği yok
              </div>
        }
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Bildirimler</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-4 mb-6">
          <Button
            type={activeTab === 'all' ? 'primary' : 'default'}
            className={`w-full sm:w-auto ${
              activeTab === 'all' 
                ? 'bg-black hover:bg-gray-800 border-none text-white' 
                : 'bg-white hover:bg-gray-100 border border-gray-300 text-black'
            }`}
            onClick={() => setActiveTab('all')}
          >
            Tüm Bildirimler
          </Button>
          <Button
            type={activeTab === 'followRequests' ? 'primary' : 'default'}
            className={`w-full sm:w-auto ${
              activeTab === 'followRequests' 
                ? 'bg-black hover:bg-gray-800 border-none text-white' 
                : 'bg-white hover:bg-gray-100 border border-gray-300 text-black'
            }`}
            onClick={() => setActiveTab('followRequests')}
          >
            Takip İstekleri ({notification.followRequests.length})
          </Button>
        </div>

        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default NotificationDetails;