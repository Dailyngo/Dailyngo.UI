'use client'; // Bileşeni istemci tarafında çalışacak şekilde işaretliyoruz

import { BirthdayUser } from "@/store/slices/usersSlice";

const BirthdayCard = ({ user, isEmpty }: { user?: BirthdayUser; isEmpty?: boolean }) => {
  // Eğer doğum günü yoksa, sadece mesaj gösterelim
  if (isEmpty) {
    return (
      <div className="bg-gray-300 text-gray-700 rounded-2xl p-6 w-96 text-center shadow-lg relative">
        <p className="text-lg">Bugün kimsenin doğum günü yok.</p>
      </div>
    );
  }

  const today = new Date();
  const birthDate = new Date(user?.birthDate ?? '');
  const age = today.getFullYear() - birthDate.getFullYear();

  // Kullanıcının isminin ilk harfini alıyoruz
  const firstLetter = user?.fullName.charAt(0).toUpperCase();

  // Doğum günü olan kişiye özel gösterimler
  const isBirthdayToday = today.toDateString() === birthDate.toDateString();

  return (
    <div className={`rounded-2xl p-6 w-96 text-center shadow-lg relative ${isBirthdayToday ? 'bg-teal-400 text-white' : 'bg-gray-200 text-gray-600'}`}>
      {/* Eğer bugün doğum günü olan bir kişi varsa başlık ve emoji gösterilecek */}
      {isBirthdayToday && (
        <>
          <div className="absolute top-3 left-3 text-xl">🎁</div>
          <div className="relative w-16 h-16 mx-auto mb-2">
            {/* Kullanıcı adı harfini yuvarlak içinde gösteriyoruz */}
            <div className="flex items-center justify-center w-16 h-16 bg-black text-white rounded-full text-2xl font-bold">
              {firstLetter}
            </div>
            <div className="absolute -top-1 -right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
              {age}
            </div>
          </div>
        </>
      )}

      {isBirthdayToday ? (
        <>
          <h2 className="font-bold text-lg">{user?.fullName} bugün {age} yaşına giriyor!</h2>
          <p className="text-sm mt-1">
            Duvarlarına bir şeyler bırakarak en iyi dileklerinizi iletin.
          </p>
          <button className="mt-4 px-4 py-2 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-100">
            Mesaj Yaz
          </button>
        </>
      ) : (
        <p className="text-lg mt-4">Bugün doğum günü olan kimse yok.</p>
      )}
    </div>
  );
};

export default BirthdayCard;
