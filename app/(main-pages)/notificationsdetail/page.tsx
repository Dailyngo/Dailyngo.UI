'use client';

import React, { useState, useEffect } from 'react';

type Notification = {
  id: number;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  isFollowRequest?: boolean; 
  isLike?: boolean; 
  isComment?: boolean; 
};

const NotificationDetails = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'followRequests'>('all');
  const [loading, setLoading] = useState<boolean>(true); 

 
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications'); // API endpoint
      if (!response.ok) {
        throw new Error('Bildirimler alınamadı.');
      }
      const data: Notification[] = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('API Hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = (id: number) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notif) =>
      !notif.isFollowRequest ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications);
  };

  const handleTabClick = (tab: 'all' | 'followRequests') => {
    setActiveTab(tab);
  };

  const renderIcon = (title: string, isFollowRequest?: boolean, isLike?: boolean, isComment?: boolean) => {
    if (isFollowRequest) {
      return <div className="text-blue-500">👤</div>;  
    }
    if (isLike) {
      return <div className="text-red-500">❤️</div>;  
    }
    if (isComment) {
      return <div className="text-green-500">💬</div>; 
    }
    if (title.includes('uyarı')) return <div className="text-yellow-500">⚠️</div>;
    if (title.includes('tamamlandı')) return <div className="text-green-500">✔️</div>;
    return <div className="text-blue-500">🔔</div>;
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;
  const followRequestCount = notifications.filter((notif) => notif.isFollowRequest && !notif.isRead).length;

  if (loading) {
    return <div className="text-center text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bildirimler</h1>

        {/* Tablar */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => handleTabClick('all')}
            className={`text-lg font-semibold ${
              activeTab === 'all' ? 'text-black border-b-2 border-black' : 'text-gray-400'
            }`}
          >
            Tüm Bildirimler ({unreadCount})
          </button>
          <button
            onClick={() => handleTabClick('followRequests')}
            className={`text-lg font-semibold ${
              activeTab === 'followRequests' ? 'text-black border-b-2 border-black' : 'text-gray-400'
            }`}
          >
            Takip İstekleri ({followRequestCount})
          </button>
        </div>

        {/* Tüm Bildirimler Tabı */}
        {activeTab === 'all' && (
          <>
            {/* Hepsini Okundu Olarak İşaretle Butonu */}
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 bg-black text-white text-sm px-3 py-1 rounded-md hover:bg-gray-800"
              >
                <span>Okundu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-check-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
                  <path d="M10.97 6.97a.235.235 0 0 1 .02.022l-3.992 4.992a.75.75 0 0 1-1.08.02L5.324 10.5a.75.75 0 1 1 1.08-1.04l1.094 1.093 3.493-4.493a.75.75 0 0 1 1.08 1.04z" />
                </svg>
              </button>
            </div>

            {/* Tüm Bildirimler Listesi */}
            <div>
              <ul className="space-y-3">
                {notifications
                  .filter((notif) => !notif.isFollowRequest) // Takip isteklerini hariç tut
                  .map((notif) => (
                    <li
                      key={notif.id}
                      className={`relative bg-white px-6 py-4 rounded-md shadow-sm hover:shadow-md transition cursor-pointer ${
                        !notif.isRead ? 'border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{renderIcon(notif.title, notif.isFollowRequest, notif.isLike, notif.isComment)}</div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              notif.isRead ? 'text-gray-700' : 'text-gray-900'
                            }`}
                          >
                            {notif.title}
                          </p>
                          <p className="text-sm text-gray-600">{notif.message}</p>
                        </div>
                        <div className="text-xs text-gray-500 absolute top-2 right-4">
                          {notif.date}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}

        {/* Takip İstekleri Tabı */}
        {activeTab === 'followRequests' && (
          <div>
            <ul className="space-y-3">
              {notifications
                .filter((notif) => notif.isFollowRequest)
                .map((notif) => (
                  <li
                    key={notif.id}
                    className={`relative bg-white px-6 py-4 rounded-md shadow-sm hover:shadow-md transition cursor-pointer ${
                      !notif.isRead ? 'border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{renderIcon(notif.title, notif.isFollowRequest)}</div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            notif.isRead ? 'text-gray-700' : 'text-gray-900'
                          }`}
                        >
                          {notif.title}
                        </p>
                        <p className="text-sm text-gray-600">{notif.message}</p>
                      </div>
                      <div className="text-xs text-gray-500 absolute top-2 right-4">
                        <div>{notif.date}</div> 
                      </div>
                    </div>
                    {!notif.isRead ? (
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                          onClick={() => {
                            // Kabul Et işlemi
                            markAsRead(notif.id);
                            setTimeout(() => {
                              setNotifications((prev) =>
                                prev.filter((n) => n.id !== notif.id)
                              );
                            }, 1000); // saniye sonra bildirimi kaldır
                          }}
                        >
                          Kabul Et
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          onClick={() => {
                            // Yoksay işlemi
                            setNotifications((prev) =>
                              prev.filter((n) => n.id !== notif.id)
                            );
                          }}
                        >
                          Yoksay
                        </button>
                      </div>
                    ) : (
                      <div className="text-green-600 text-sm font-medium mt-4">
                        İstek kabul edildi
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDetails;
