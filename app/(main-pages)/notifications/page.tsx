'use client';

import Image from 'next/image';
import React from 'react';

type User = {
  id: number;
  name: string;
  birthDate: string;
  profileImage: string;
  isFollowing: boolean;
};

const BirthdayCard = ({ user }: { user: User }) => {
  const today = new Date();
  const birthDate = new Date(user.birthDate);
  const age = today.getFullYear() - birthDate.getFullYear();

  return (
    <div className="bg-teal-400 rounded-2xl p-6 w-96 text-center shadow-lg relative text-white">
      <div className="absolute top-3 left-3 text-xl">🎁</div>

      <div className="relative w-16 h-16 mx-auto mb-2">
        <Image
          src="/default-icon.png" // Yerel ikon dosyasını buraya ekledik
          alt={user.name}
          className="rounded-full"
          width={64} // İkon boyutunu belirtelim
          height={64} // İkon boyutunu belirtelim
        />
        <div className="absolute -top-1 -right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
          {age}
        </div>
      </div>

      <h2 className="font-bold text-lg">{user.name} bugün {age} yaşına giriyor!</h2>
      <p className="text-sm mt-1">
      Duvarlarına bir şeyler bırakarak en iyi dileklerinizi iletin.
      </p>
      <button className="mt-4 px-4 py-2 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-100">
        Mesaj Yaz
      </button>
    </div>
  );
};

const isTodayBirthday = (birthDate: string) => {
  const today = new Date();
  const date = new Date(birthDate);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth()
  );
};

export default function NotificationsPage() {
  // Dummy users (bu verileri sonra API'den çekeceğiz)
  const users: User[] = [
    {
      id: 1,
      name: 'Dan Brown',
      birthDate: '1993-04-20',
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg', // Geçici URL, yerel ikonla değiştirdik
      isFollowing: true,
    },
    {
      id: 2,
      name: 'Emily Rose',
      birthDate: '1994-06-15',
      profileImage: 'https://randomuser.me/api/portraits/women/2.jpg', // Geçici URL, yerel ikonla değiştirdik
      isFollowing: true,
    },
    {
      id: 3,
      name: 'Jake Long',
      birthDate: '1995-04-20',
      profileImage: 'https://randomuser.me/api/portraits/men/3.jpg', // Geçici URL, yerel ikonla değiştirdik
      isFollowing: false,
    },
  ];

  const todayBirthdays = users.filter(
    (user) => user.isFollowing && isTodayBirthday(user.birthDate)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎂 Birthdays Today</h1>
      <div className="flex gap-4 flex-wrap">
        {todayBirthdays.length > 0 ? (
          todayBirthdays.map((user) => (
            <BirthdayCard key={user.id} user={user} />
          ))
        ) : (
          <p>No birthdays today among people you follow.</p>
        )}
      </div>
    </div>
  );
}






/*"use-client"

import React from "react";

const Notifications = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold">Search Page</h1>
        </div>
    );
}

export default Notifications;*/