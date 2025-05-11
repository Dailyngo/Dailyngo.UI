"use client";
import React, { use, useEffect, useState } from "react";
import moment from "moment";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, Button, DatePicker, Input, Select, Menu, Card, Tabs, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useStore } from "@/store";
import PostCard from "../homepage/postCard";
import { UserProfileData } from "@/store/slices/usersSlice";
import { ERRORS } from "@/store/slices/errorSlice";
import { Link } from "react-router-dom";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("posts");
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowersTab, setIsFollowersTab] = useState(true);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
    getFollowUsers,
    unfollowUser,
    removeFollower,
    setErrorConfirmInfoModal,
    followUsers,
  } = useStore();

  // Tab menü öğeleri
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
      getUserPosts(userId);
    } else if (activeTab === "friends") {
      getFollowUsers(isFollowersTab, userId, 1);
      setPageNumber(1);
    }
  }, [activeTab, isFollowersTab]);

  const getUserProfileCardData = async () => {
    try {
      console.log("userId", userId);
      const data = await getUserProfileCard(userId);
      setUserProfileData(data);
    } catch (error) {
      console.error("Kullanıcı profil verileri alınamadı:", error);
    }
  };

  useEffect(() => {
    getUserProfileCardData();
  }, []);

  const loadMoreFriends = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const nextPage = pageNumber + 1;
    await getFollowUsers(isFollowersTab, userId, nextPage);
    setPageNumber(nextPage);
    setIsLoading(false);
  };

  const handleFollowToggle = async (followUserId: string, isCurrentlyFollowing: boolean) => {
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(followUserId);
      } else {
        await createFollowRequest(followUserId);
      }
      // Listeyi güncelle
      await getFollowUsers(isFollowersTab, userId, 1);
    } catch (error) {
      console.error("Takip işlemi başarısız oldu:", error);
    }
  };

  const handleRemoveFollower = async (followerId: string) => {
    setSelectedUserId(followerId);
    setConfirmModalVisible(true);
  };

  const confirmRemoveFollower = async () => {
    if (!selectedUserId) return;
    
    try {
      await removeFollower(selectedUserId);
      await getFollowUsers(isFollowersTab, userId, 1);
    } catch (error) {
      console.error("Takipçi çıkarma işlemi başarısız oldu:", error);
    } finally {
      setConfirmModalVisible(false);
      setSelectedUserId(null);
    }
  };

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
          />
        );
      case "posts":
        return (
          userPosts &&
          userPosts.map((post) => (
            <PostCard key={post.id} post={post} onlyView={false} />
          ))
        );
      case "friends":
        const friendsList = followUsers[userId || ''] || [];
        return (
          <div className="mt-2 sm:mt-4 space-y-3 sm:space-y-4">
            <div className="flex justify-center mb-3 sm:mb-4 mt-1">
              <div className="flex bg-gray-100 p-1 rounded-md w-full max-w-xs">
                <button
                  className={`flex-1 px-3 sm:px-5 py-2 rounded-md font-medium transition-all duration-200 ${
                    isFollowersTab
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setIsFollowersTab(true)}
                >
                  Takip
                </button>
                <button
                  className={`flex-1 px-3 sm:px-5 py-2 rounded-md font-medium transition-all duration-200 ${
                    !isFollowersTab
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setIsFollowersTab(false)}
                >
                  Takipçi
                </button>
              </div>
            </div>
            {friendsList.length > 0 ? (
              <>
                {friendsList.map((friend) => (
                  <div
                    key={friend.userId}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm transition-all duration-200"
                  >
                    {/* Profil Resmi ve Bilgiler */}
                    <div
                      className="flex items-center cursor-pointer w-full sm:w-auto"
                      onClick={() => {
                        console.log(`Tıklanan kullanıcı: ${friend.fullName}, ID: ${friend.userId}`);
                        router.push(`/users/${friend.userId}`);
                      }}
                    >
                      <Avatar
                        size={40}
                        src={friend.profilePicture}
                        className="mr-3 border-2 border-white shadow-sm"
                        style={{ borderRadius: "50%" }}
                      />
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">{friend.fullName}</h3>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium">@{friend.userName}</p>
                      </div>
                    </div>

                    {/* Takip Durumu Bilgisi ve Butonlar */}
                    <div className="flex items-center mt-3 sm:mt-0 w-full sm:w-auto justify-end">
                      {/* Takip/Takipten Çık Butonu */}
                      {friend.isOwner ? (
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">Siz</span>
                      ) : (
                        <>
                          {friend.isFollowRequest ? (
                            <Input
                              value="İstek Gönderildi"
                              disabled
                              className="bg-gray-200 text-gray-700 cursor-not-allowed text-center w-30"
                            />
                          ) : (
                            <Button
                              type={friend.isFollowing ? "default" : "primary"}
                            onClick={() => {
                              handleFollowToggle(friend.userId, friend.isFollowing);
                            }}
                            className={`text-xs sm:text-sm py-1 h-8 ${
                              friend.isFollowing
                                ? "border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
                                : "bg-black hover:bg-gray-800 text-white border-none shadow-sm transition-all duration-200"
                            }`}
                          >
                            {
                               (friend.isFollowing ? "Takipten Çık" : friend.isFollower ?  "Sende Takip Et" : "Takip Et")
                            }
                          </Button>
                          )}
                          
                          {!isFollowersTab && (
                            <Button 
                              type="text" 
                              className="hover:bg-gray-100 ml-2 px-2 h-8" 
                              onClick={() => handleRemoveFollower(friend.userId)}
                              icon={<Icon icon="mdi:close" className="text-gray-500" />}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {/* Daha Fazla Yükle butonu, sadece tam 40'ın katı kadar kullanıcı varsa göster */}
                {friendsList.length > 0 && friendsList.length % 40 === 0 && (
                  <div className="text-center py-4 sm:py-6">
                    <Button
                      type="primary"
                      loading={isLoading}
                      className="bg-black hover:bg-gray-800 text-white font-medium px-4 sm:px-6 h-9 sm:h-10 rounded-full shadow-sm text-sm sm:text-base"
                      onClick={loadMoreFriends}
                    >
                      Daha Fazla Yükle
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-flex justify-center items-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <Icon icon="ant-design:user-outlined" width="42" className="text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                  {isFollowersTab 
                    ? "Henüz takipçiniz yok" 
                    : "Henüz takip ettiğiniz kimse yok"}
                </h3>
                <p className="text-gray-500 mt-2 text-sm sm:text-base px-4 sm:px-0">
                  {isFollowersTab
                    ? "Profilinizi paylaşarak daha fazla takipçi edinebilirsiniz"
                    : "İlgilendiğiniz kullanıcıları takip etmeye başlayabilirsiniz"}
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const followRequestHandler = async (isAccept: boolean) => {
    const receiverId = userProfileData?.sendReceiverRequestId;
    if (!receiverId) return;
    await answerFollowRequest(receiverId, isAccept);
    if(!followErrors){
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
  }


  return (
    <div className="flex-1 max-w-3xl mx-auto bg-white p-3 sm:p-6 mt-4 sm:mt-6 rounded-xl shadow-sm">
      {userId && userProfileData?.isReceiverFollowRequest && (
        <div className="bg-gray-200 p-2 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-around gap-2 mb-4">
          <span className="font-semibold text-gray-700">
            Takip İsteği
          </span>
          <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-center">
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
      <div className="bg-gray-50 p-3 sm:p-6 rounded-xl mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Profile Picture */}
          {userProfileData?.getUserResponse?.profilePicture ? (
            <Avatar
              size={100}
              src={
                userProfileData?.getUserResponse?.profilePicture
              }
              icon={<Icon icon="ant-design:user-outlined" />}
              className="bg-gray-800 shadow-lg"
            />
          ) : (
            <Avatar
              size={100}
              icon={<Icon icon="ant-design:user-outlined" />}
              className="bg-gray-800 shadow-lg"
            />
          )}
          <div className="flex-1 text-center sm:text-left mt-3 sm:mt-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {userProfileData?.getUserResponse?.fullName ??
                "name"}
            </h2>
            <p className="text-gray-600 mb-4">
              @
              {userProfileData?.getUserResponse?.userName ??
                "username"}
            </p>
            <div className="flex justify-center sm:justify-start gap-4 sm:gap-6">
              <div className="text-center">
                <span className="block text-lg sm:text-xl font-semibold text-gray-800">
                  {userProfileData?.postCount ?? 0}
                </span>
                <span className="text-gray-500 text-sm sm:text-base">Gönderi</span>
              </div>
              <div className="text-center">
                <span className="block text-lg sm:text-xl font-semibold text-gray-800">
                  {userProfileData?.following ?? 0}
                </span>
                <span className="text-gray-500 text-sm sm:text-base">Takip</span>
              </div>
              <div className="text-center">
                <span className="block text-lg sm:text-xl font-semibold text-gray-800">
                  {userProfileData?.follower ?? 0}
                </span>
                <span className="text-gray-500 text-sm sm:text-base">Takipçi</span>
              </div>
            </div>
          </div>
          {userId && (
            <div className="flex justify-center sm:justify-start mt-4 w-full sm:w-auto">
              {userProfileData?.isSendFollowRequest ? (
                <Input
                  value="İstek Gönderildi"
                  disabled
                  className="bg-gray-200 text-gray-700 cursor-not-allowed text-center"
                />
              ) : (
                !userProfileData?.isFollowing ? (
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
                : (
                  <Button
                  type="default"
                    onClick={() => {
                      handleFollowToggle(userId, true);
                    }}
                    className={`text-xs sm:text-sm py-1 h-8 border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200`}
                  >
                    Takipten Çık
                  </Button>
                )
              )}
            </div>
          )}
        </div>
        <div className="mt-4 text-center sm:text-left">
          <p className="text-gray-700">{userProfileData?.bio}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap px-1">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.map(item => ({
            ...item,
            label: (
              <span
                className={
                  (activeTab === item.key
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200") +
                  " transition-all duration-200 rounded-full px-3 sm:px-5 py-1 sm:py-2 text-sm sm:text-base font-semibold cursor-pointer"
                }
              >
                {item.label}
              </span>
            ),
          }))}
          className="mx-auto custom-tabs"
          tabBarGutter={8}
        />
      </div>

      <div className="p-2 sm:p-4">{renderContent()}</div>

      {/* Takipçi Çıkarma Onay Modal'ı */}
      <Modal
        title="Takipçiyi Çıkar"
        open={confirmModalVisible}
        onOk={confirmRemoveFollower}
        onCancel={() => setConfirmModalVisible(false)}
        okText="Evet, Çıkar"
        cancelText="İptal"
        okButtonProps={{ 
          style: { background: '#000', borderColor: '#000' } 
        }}
      >
        <p>Bu kişiyi takipçilerinizden çıkarmak istediğinizden emin misiniz?</p>
      </Modal>
    </div>
  );
};

const AboutContent = ({ 
  about,
  isBioOpen,
  isEditing,
  onBioToggle,
  onEditToggle
}: {
  about: AboutData | null;
  isBioOpen: boolean;
  isEditing: boolean;
  onBioToggle: () => void;
  onEditToggle: () => void;
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