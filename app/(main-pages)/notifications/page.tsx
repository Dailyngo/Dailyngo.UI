'use client'; // Bileşeni istemci tarafında çalışacak şekilde işaretliyoruz

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store'; // zustand store yolunu senin projene göre güncelle
import BirthdayCard from '@/components/homepage/birthDayCard';
import NotificationDetails from '@/components/notifications/notificationDetails';

const NotificationsPage = () => {
 
  return(
    <NotificationDetails/>
  );
};

export default NotificationsPage;
