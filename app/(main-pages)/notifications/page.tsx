'use client'; // Bileşeni istemci tarafında çalışacak şekilde işaretliyoruz

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store'; // zustand store yolunu senin projene göre güncelle
import BirthdayCard from '@/components/homepage/birthDayCard';

const NotificationsPage = () => {
  const { birthdays, loading, error, fetchBirthdays } = useStore((state) => state);
  const [isEmpty, setIsEmpty] = useState<boolean | null>(null); // Başlangıçta null olacak

  useEffect(() => {
    fetchBirthdays(); // Sayfa açıldığında doğum günlerini çek
  }, [fetchBirthdays]);

  // Veriler yüklendikten sonra isEmpty durumunu kontrol ediyoruz
  useEffect(() => {
    if (birthdays && birthdays.length === 0) {
      setIsEmpty(true); // Eğer doğum günü olan kimse yoksa
    } else {
      setIsEmpty(false); // Eğer doğum günü olan kişiler varsa
    }
  }, [birthdays]);

  if (loading) {
    return <p>Yükleniyor...</p>; // Yükleniyor durumu sırasında başlık gösterilmesin
  }

  // Eğer isEmpty değeri null değilse, yani veri yüklendiyse, başlık ve içerikleri render ediyoruz
  return (
    <div className="p-6">
      {isEmpty === null ? (
        <p>Yükleniyor...</p> // Eğer veri henüz yüklenmediyse, yükleniyor mesajı gösterilsin
      ) : (
        <>
          {/* Eğer isEmpty false ise başlık ve kartlar gösterilecek */}
          {!isEmpty && (
            <>
              <h1 className="text-2xl font-bold mb-4"> Bugün Doğanlar</h1>
              <div className="flex gap-4 flex-wrap">
                {birthdays.map((user) => (
                  <BirthdayCard key={user.id} user={user} />
                ))}
              </div>
            </>
          )}

          {/* Eğer doğum günü yoksa bu mesajı göster */}
          {isEmpty && (
            <div className="bg-gray-300 text-gray-700 rounded-2xl p-6 w-96 text-center shadow-lg relative">
              <p className="text-lg">Bugün kimsenin doğum günü yok.</p>
            </div>
          )}
        </>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default NotificationsPage;
