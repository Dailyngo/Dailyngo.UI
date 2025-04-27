"use client";
import React, { use, useEffect, useState } from "react";
import moment from "moment";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, Button, DatePicker, Input, Select, Menu } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useStore } from "@/store";
import PostCard from "../homepage/postCard";
import { UserProfileData } from "@/store/slices/usersSlice";
import { ERRORS } from "@/store/slices/errorSlice";

interface UserProfileProps {
  userId?: string | null;
}

interface AboutData {
  department?: {
    name?: string;
    faculty?: {
      name?: string;
    };
  };
  gender?: number;
  birthDate?: string | null | undefined;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Ayarlar açma/kapatma durumu
  const [newPassword, setNewPassword] = useState(""); // Yeni şifre
  const [confirmPassword, setConfirmPassword] = useState(""); // Yeni şifreyi onaylama
  const [oldPassword, setOldPassword] = useState(""); // Eski şifre

  const [userProfileData, setUserProfileData] =
    useState<UserProfileData | null>(null);
  const {
    userPosts,
    getUserPosts,
    about,
    getOwnAbout,
    getUserProfileCard,
    answerFollowRequest,
    createFollowRequest,
    followErrors,
    setErrorConfirmInfoModal,
  } = useStore();

  const tabItems = [
    { key: "posts", label: "Gönderiler" },
    { key: "about", label: "Hakkında" },
    { key: "friends", label: "Arkadaşlar" },
    { key: "badges", label: "Rozetler" },
  ];

  useEffect(() => {
    if (!about) getOwnAbout();
  }, [about, getOwnAbout]);

  useEffect(() => {
    if (activeTab === "posts") {
      if (userPosts) {
        getUserPosts(userId);
      }
    }
  }, [activeTab]);

  const getUserProfileCardData = async () => {
    try {
      const data = await getUserProfileCard(userId);
      setUserProfileData(data);
    } catch (error) {
      console.error("Kullanıcı profil verileri alınamadı:", error);
    }
  };

  useEffect(() => {
    getUserProfileCardData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <AboutContent
            about={about}
            isBioOpen={isBioOpen}
            isEditing={isEditing}
            onBioToggle={() => setIsBioOpen(!isBioOpen)}
            onEditToggle={() => setIsEditing(!isEditing)}
            isOwnProfile={!userId}
          />
        );
      case "posts":
        return (
          userPosts &&
          userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        );
      default:
        return null;
    }
  };

  const followRequestHandler = async (isAccept: boolean) => {
    const receiverId = userProfileData?.sendReceiverRequestId;
    if (!receiverId) return;
    await answerFollowRequest(receiverId, isAccept);
    if (!followErrors) {
      await getUserProfileCardData();
    }
  };

  useEffect(() => {
    if (followErrors) {
      setErrorConfirmInfoModal(
        ERRORS.GENERIC_INFO_AND_ERRORS,
        "Hata",
        followErrors,
        "error"
      );
    }
  }, [followErrors]);

  const createFollowRequestHandler = async () => {
    if (!userId) return;
    await createFollowRequest(userId);
    if (!followErrors) {
      await getUserProfileCardData();
    }
  };

  // Şifre kaydetme işlemi
  const handlePasswordSave = () => {
    if (newPassword !== confirmPassword) {
      alert("Şifreler uyuşmuyor!");
      return;
    }
    console.log("Yeni Şifre:", newPassword);
    alert("Şifre başarıyla kaydedildi! (Simülasyon)");
    setNewPassword("");
    setConfirmPassword("");
    setOldPassword(""); // Eski şifreyi sıfırlama
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto bg-white p-6 mt-6 rounded-xl shadow-sm">
      {userId && userProfileData?.isReceiverFollowRequest && (
        <div className="bg-gray-200 p-2 rounded-lg shadow-md flex items-center justify-around mb-4">
          <span className="font-semibold text-gray-700">Takip İsteği</span>
          <div className="flex gap-2">
            <Button
              type="primary"
              className="bg-black hover:bg-gray-800 border-none text-white"
              onClick={async () => {
                await followRequestHandler(true);
              }}
            >
              Onayla
            </Button>
            <Button
              type="default"
              className="bg-white hover:bg-gray-100 border border-gray-300 text-black"
              onClick={async () => {
                await followRequestHandler(false);
              }}
            >
              Reddet
            </Button>
          </div>
        </div>
      )}
      {/* Profile Header Card */}
      <div className="bg-gray-50 p-6 rounded-xl mb-6 relative">
        {/* Ayarlar ikonu */}
        {!userId && (
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <Icon icon="mdi:cog" width="28" />
          </button>
        )}

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Picture */}
          {userProfileData?.getUserResponse?.profilePicture ? (
            <Avatar
              size={120}
              src={userProfileData?.getUserResponse?.profilePicture}
              icon={<Icon icon="ant-design:user-outlined" />}
              className="bg-gray-800 shadow-lg"
            />
          ) : (
            <Avatar
              size={120}
              icon={<Icon icon="ant-design:user-outlined" />}
              className="bg-gray-800 shadow-lg"
            />
          )}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {userProfileData?.getUserResponse?.fullName ?? "name"}
            </h2>
            <p className="text-gray-600 mb-4">
              @{userProfileData?.getUserResponse?.userName ?? "username"}
            </p>
            <div className="flex justify-center md:justify-start gap-6">
              <div className="text-center">
                <span className="block text-xl font-semibold text-gray-800">
                  {userProfileData?.postCount ?? 0}
                </span>
                <span className="text-gray-500">Gönderi</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-semibold text-gray-800">
                  {userProfileData?.following ?? 0}
                </span>
                <span className="text-gray-500">Takip</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-semibold text-gray-800">
                  {userProfileData?.follower ?? 0}
                </span>
                <span className="text-gray-500">Takipçi</span>
              </div>
            </div>
          </div>
          {userId && (
            <div className="flex justify-center md:justify-start mt-4">
              {userProfileData?.isSendFollowRequest ? (
                <Input
                  value="İstek Gönderildi"
                  disabled
                  className="bg-gray-200 text-gray-700 cursor-not-allowed text-center"
                />
              ) : (
                !userProfileData?.isFollowing && (
                  <Button
                    type="primary"
                    onClick={async () => {
                      await createFollowRequestHandler();
                    }}
                    className="bg-black hover:bg-gray-800 border-none text-white"
                  >
                    Takip Et
                  </Button>
                )
              )}
            </div>
          )}
        </div>
        <div className="mt-4 text-center md:text-left">
          <p className="text-gray-700">{userProfileData?.bio}</p>
        </div>
      </div>

      {/* Şifre Değiştir Formu */}
      {isSettingsOpen && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Şifre Değiştir
          </h3>
          <div className="space-y-4">
            <Input.Password
              placeholder="Eski Şifre"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input.Password
              placeholder="Yeni Şifre"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input.Password
              placeholder="Yeni Şifre (Tekrar)"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="primary"
              className="bg-black hover:bg-gray-800 border-none text-white w-full"
              onClick={handlePasswordSave}
            >
              Şifreyi Kaydet
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <Menu
          mode="horizontal"
          selectedKeys={[activeTab]}
          onSelect={({ key }) => setActiveTab(key as string)}
          items={tabItems}
          className="border-b-0 text-lg w-full max-w-2xl"
          style={{
            borderBottom: "none",
            fontSize: "1.125rem",
            fontWeight: "500",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        />
      </div>

      <div className="p-4">{renderContent()}</div>
    </div>
  );
};

const AboutContent = ({
  about,
  isBioOpen,
  isEditing,
  onBioToggle,
  onEditToggle,
  isOwnProfile,
}: {
  about: AboutData | null;
  isBioOpen: boolean;
  isEditing: boolean;
  onBioToggle: () => void;
  onEditToggle: () => void;
  isOwnProfile: boolean;
}) => {
  const genderOptions = [
    { value: 0, label: "Belirtilmemiş" },
    { value: 1, label: "Erkek" },
    { value: 2, label: "Kadın" },
  ];

  return (
    <div className="pb-4">
      <div
        className="grid grid-cols-12 bg-gray-50 p-2 cursor-pointer rounded-lg gap-2"
        onClick={onBioToggle}
      >
        <div className="col-span-12 md:col-span-3 lg:col-span-2 flex items-center gap-2">
          <Icon
            icon={isBioOpen ? "ant-design:caret-up-outlined" : "ant-design:caret-down-outlined"}
            width="24"
            className="text-gray-500"
          />
          <span className="font-bold text-gray-600">Biyografi</span>
        </div>
      </div>

      {isBioOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="col-span-3 bg-white p-3 rounded-lg space-y-4">
            {isOwnProfile && (
              <div className="flex justify-end gap-2">
                <Button
                  type="primary"
                  className="bg-gray-800 hover:bg-gray-900 border-none text-white"
                  onClick={onEditToggle}
                  icon={<Icon icon={isEditing ? "mdi:content-save" : "mdi:pencil"} />}
                >
                  {isEditing ? "Kaydet" : "Düzenle"}
                </Button>
              </div>
            )}

            <TextArea
              className="w-full p-2 rounded-lg"
              rows={6}
              placeholder="Biyografinizi buraya yazın..."
              value={about?.department?.name || ""}
              disabled={!isEditing}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Ad Soyad"
                value={about?.department?.faculty?.name || ""}
                disabled={!isEditing}
              />
              <Select
                placeholder="Cinsiyet"
                options={genderOptions}
                value={about?.gender}
                disabled={!isEditing}
              />
              <DatePicker
                placeholder="Doğum Tarihi"
                format="DD/MM/YYYY"
                value={about?.birthDate && moment(about.birthDate)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;