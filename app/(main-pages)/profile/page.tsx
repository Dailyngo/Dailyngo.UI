"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, Button, DatePicker, Input, Select, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import TextArea from "antd/lib/input/TextArea";
import { useStore } from "@/store"; // Zustand store'u içeri aktar

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Gönderiler");
  const [isOpen, setIsOpen] = useState(false);
  const [onEdit, setOnEdit] = useState(false);

  // Zustand store'dan değerleri çekiyoruz
  const { about, loading, error, getOwnAbout } = useStore();

  const genderOptions = [
    { value: 0, label: "Belirtilmemiş" },
    { value: 1, label: "Erkek" },
    { value: 2, label: "Kadın" },
  ];

  // Düzenleme modunu açıp kapatma
  const handleEdit = () => {
    setOnEdit(prev => !prev); // önceki değeri tersine çevir
  };

  // Veriyi almak için useEffect kullanıyoruz, yalnızca component mount olduğunda
  useEffect(() => {
    if (!about) { // Eğer hakkında verisi yoksa, veriyi al
      getOwnAbout();
    }
  }, [about, getOwnAbout]); // about değiştiğinde yeniden çalışması sağlanıyor

  // Hakkında bilgileri düzenle
  const handleSave = () => {
    // Burada API'ye veri göndermek için bir fonksiyon çağrısı yapılabilir.
    console.log("Kayıt edildi!");
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto bg-white p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar
            size={80}
            icon={<Icon icon="ant-design:user-outlined" />}
            className="bg-purple-400"
          />
          <div>
            <h2 className="text-xl font-semibold">Burakhan</h2>
            <p className="text-gray-500">100 takip</p>
            <p className="text-gray-500">100 takipçi</p>
          </div>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
        }}
        className="w-full p-6 flex items-center justify-between"
      >
        <TabPane tab="Gönderiler" key="posts" className={`min-w-xs pb-2`}></TabPane>
        <TabPane tab="Hakkında" key="about" className={`min-w-xs pb-2`}>
          <div className="pb-4">
            <div
              className="grid grid-cols-12 bg-gray-50 p-2 cursor-pointer rounded-lg gap-2"
              onClick={() => setIsOpen(prev => !prev)} // isOpen değerini tersine çeviriyoruz
            >
              <div className="col-span-12 md:col-span-3 lg:col-span-2 flex items-center gap-2 w-full">
                {isOpen ? (
                  <Icon
                    icon="ant-design:caret-up-outlined"
                    width="24"
                    height="24"
                    className="text-gray-500 shrink-0"
                  />
                ) : (
                  <Icon
                    icon="ant-design:caret-down-outlined"
                    width="24"
                    height="24"
                    className="text-gray-500 shrink-0"
                  />
                )}
                <span className="font-bold text-gray-600 truncate min-w-100">
                  Biyografi
                </span>
              </div>
            </div>

            {isOpen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-3 bg-white p-3 rounded-lg w-full mx-auto flex flex-col space-y-4">
                  <div className="flex items-center justify-end">
                    {!onEdit && (
                      <div className="flex items-center pr-2">
                        <Button
                          type="primary"
                          className="hover:bg-purple-200 border-none text-white rounded-md"
                          onClick={handleSave} // Save button'u kaydetme işlemi için
                        >
                          Kaydet
                        </Button>
                      </div>
                    )}
                    <Button
                      type="primary"
                      className="bg-purple-600 hover:bg-purple-200 border-none text-white rounded-md"
                      onClick={handleEdit}
                    >
                      {onEdit ? (
                        <Icon
                          icon="material-symbols:edit-outline"
                          width="24"
                          height="24"
                        />
                      ) : (
                        <Icon
                          icon="material-symbols:edit-off-outline"
                          width="24"
                          height="24"
                        />
                      )}
                    </Button>
                  </div>
                  <TextArea
                    className="w-full p-2 rounded-lg"
                    rows={6}
                    placeholder="Biyografinizi buraya yazın..."
                    value={about ? about.department?.name : ''}
                    disabled={!onEdit}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Input
                      placeholder="Ad Soyad"
                      className="w-full rounded-lg min-h-10 p-2"
                      value={about ? about.department?.faculty?.name : ''}
                      disabled={!onEdit}
                    />
                    <Select
                      placeholder="Cinsiyet"
                      className="w-full rounded-lg min-h-10"
                      options={genderOptions}
                      value={about ? (about.gender === 1 ? 'Erkek' : 'Kadın') : ''}
                      disabled={!onEdit}
                    />
                    <DatePicker
                      placeholder="Doğum Tarihi"
                      className="w-full rounded-lg min-h-10 p-2"
                      format="DD/MM/YYYY"
                      value={about ? moment(about.birthDate) : null}
                      disabled={!onEdit}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabPane>
        {/* Diğer TabPane'ler */}
      </Tabs>
    </div>
  );
}
