"use client";
import React, { useState } from "react";
import { Bell, Menu, MessageCircle, Search, User } from "lucide-react";
import { Icon } from "@iconify/react/dist/iconify.js";

// Global CSS
const globalStyles = `
  body, html {
    background-color: white;
  }
`;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Gönderiler");
  const [activeSubTab, setActiveSubTab] = useState(""); 

  return (
    <>
      <style>{globalStyles}</style>
      <div className="h-screen bg-white"> 
         <div className="w-full bg-white shadow-md p-6 flex items-center justify-between border-2 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-gray-700">LOGO</div>
            <div className="flex items-center bg-gray-200 px-3 py-2 rounded-full">
              <Menu className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Hinted search text"
                className="bg-transparent outline-none ml-2 text-sm"
              />
              <Search className="w-4 h-4 text-gray-500 ml-2" />
            </div>
          </div>

          <div className="flex items-center gap-4 text-purple-500">
            <MessageCircle className="w-6 h-6 cursor-pointer" />
            <Bell className="w-6 h-6 cursor-pointer" />
            <User className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
        <div className="flex-1 max-w-4xl mx-auto bg-white p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
             <User className="w-15 h-25 text-purple-400" />
              <div>
                <h2 className="text-xl font-semibold">Burakhan Kurt</h2>
                <p className="text-gray-500">100 takip</p>
                <p className="text-gray-500">100 takipçi</p>
              </div>
            </div>
            <button className="bg-purple-800 text-white px-4 py-2 rounded-full">Profili Düzenle</button>
          </div>

          <div className="border-b mb-4 flex justify-center space-x-6">
            {['Gönderiler', 'Hakkında', 'Arkadaşlar', 'Rozetler'].map((tab) => (
              <button 
                key={tab} 
                className={`pb-2 ${activeTab === tab ? 'border-b-2 border-purple-500 font-semibold' : 'text-gray-500'}`} 
                onClick={() => { setActiveTab(tab); setActiveSubTab(""); }} // Alt sekme durumunu sıfırlıyoruz
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Hakkında' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1 flex flex-col space-y-2">
                  <button className="bg-purple-100 p-2 rounded-lg shadow-md hover:bg-purple-200" onClick={() => setActiveSubTab("Genel Bakış")}>Genel Bakış</button> 
                  <button className="bg-purple-100 p-2 rounded-lg shadow-md hover:bg-purple-200" onClick={() => setActiveSubTab("Biyografi")}>Biyografi</button> 
                  <button className="bg-purple-100 p-2 rounded-lg shadow-md hover:bg-purple-200" onClick={() => setActiveSubTab("Eğitim")}>Eğitim</button> 
                  <button className="bg-purple-100 p-2 rounded-lg shadow-md hover:bg-purple-200" onClick={() => setActiveSubTab("İletişim")}>İletişim</button>
                  <button className="bg-purple-100 p-2 rounded-lg shadow-md hover:bg-purple-200" onClick={() => setActiveSubTab("Adres")}>Adres</button> 
                </div>

                <div className="col-span-3 bg-white p-3 rounded-lg w-full mx-auto flex flex-col space-y-4">
                  {activeSubTab === '' && (
                    <>
                      <textarea 
                        className="w-full bg-gray-100 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" 
                        rows={6}
                        placeholder="Biyografinizi buraya yazın..."
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <button className="bg-purple-100 p-2 rounded-lg shadow-md hover:bg-purple-200">Ad Soyad</button> 
                        <button className="bg-purple-100 p-2 rounded-lg shadow-md hover:bg-purple-200">Cinsiyet</button> 
                        <button className="bg-purple-100 p-2 rounded-lg shadow-md hover:bg-purple-200">Doğum Tarihi</button> 
                      </div>
                    </>
                  )}
                   {activeSubTab === 'Genel Bakış' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
                      <div className="text-center">
                        <h4 className="text-gray-600 text-sm font-semibold">Kullanıcı Adı</h4>
                        <button className="bg-gray-100 p-3 rounded-lg text-sm shadow-md">burakhankurt</button>
                      </div>
                    </div>
                  )}
                   {activeSubTab === 'Biyografi' && (
                    <>
                    <textarea 
                      className="w-full bg-gray-100 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" 
                      rows={6}
                      placeholder="Biyografinizi buraya yazın..."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <button className="bg-gray-200 px-4 py-2 rounded-lg">Ad Soyad</button> 
                      <button className="bg-gray-200 px-4 py-2 rounded-lg">Cinsiyet</button> 
                      <button className="bg-gray-200 px-4 py-2 rounded-lg">Doğum Tarihi</button> 
                    </div>
                  </>
                  )}
                  {activeSubTab === 'Eğitim' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
                      <div className="text-center">
                        <h4 className="text-gray-600 text-sm font-semibold">Üniversite</h4>
                        <button className="bg-gray-100 p-3 rounded-lg text-sm shadow-md">Erzurum Teknik Üniversitesi</button>
                      </div>
                      <div className="text-center">
                        <h4 className="text-gray-600 text-sm font-semibold">Fakülte</h4>
                        <button className="bg-gray-100 p-3 rounded-lg text-sm shadow-md">Mühendislik ve Mimarlık Fakültesi</button>
                      </div>
                      <div className="text-center">
                        <h4 className="text-gray-600 text-sm font-semibold">Bölümü</h4>
                        <button className="bg-gray-100 p-3 rounded-lg text-sm shadow-md">Bilgisayar Mühendisliği</button>
                      </div>
                    </div>
                  )}
                   {activeSubTab === 'İletişim' && (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
                     <div className="text-center">
                       <h4 className="text-gray-600 text-sm font-semibold">Telefon</h4>
                       <button className="bg-gray-100 p-3 rounded-lg text-sm shadow-md">+90 555 555 55 55</button>
                     </div>
                     <div className="text-center">
                       <h4 className="text-gray-600 text-sm font-semibold">E-posta</h4>
                       <button className="bg-gray-100 p-3 rounded-lg text-sm shadow-md">ornek@mail.com</button>
                     </div>
                   </div>
                  )}
                   {activeSubTab === 'Adres' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
                      <div className="text-center">
                       <h4 className="text-gray-600 text-sm font-semibold">Adres</h4>
                       <button className="bg-gray-100 p-3 rounded-lg text-sm shadow-md">İstanbul, Türkiye</button>
                     </div>
                    </div>
                  )}
                  {/* Diğer alt sekmeler için benzer yapılar ekleyebilirsiniz */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}