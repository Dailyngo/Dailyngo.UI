"use client";

import { Avatar, Dropdown, Button, Modal, Input } from 'antd';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store';
import { PostData } from '../../store/slices/postSlice';
import { LikeData } from '../../store/slices/likeSlice';
import { ERRORS } from '@/store/slices/errorSlice';
import LikesModal from '../ui/LikesModal';

const { TextArea } = Input;

const PostCard: React.FC<{ post: PostData }> = ({ post }) => {
  const router = useRouter();
  const { 
    deletePost,
    getPostLikes,
    likes,
    addLike,
    reportPost,
    reportError,
    removeLike,
    postError,
    setErrorConfirmInfoModal
  } = useStore();
  
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState<string>("");
  const [showLikes, setShowLikes] = useState(false);
  const [isLikesModalVisible, setIsLikesModalVisible] = useState(false);

  const handlePostClick = () => {
    router.push(`/posts/${post.id}`);
  };

  const handleReportPost = async (reason: string | null) => {
    const status = await reportPost(post.id, reason);
    if (status) {
      setErrorConfirmInfoModal(
        ERRORS.GENERIC_INFO_AND_ERRORS,
        "Başarılı",
        "Gönderi başarıyla rapor edildi.",
        "success"
      );
    }
    setIsReportModalVisible(false);
    setReportReason("");
  };

  useEffect(() => {
    if(reportError){
      setErrorConfirmInfoModal(
        ERRORS.GENERIC_INFO_AND_ERRORS,
        "Hata",
        reportError,
        "error"
      );
    }
  }, [reportError]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent post click when liking
    
    try {
      if (liked) {
        setLiked(false);
        setLikeCount(likeCount - 1);
        await removeLike(post.id);
      } else {
        setLiked(true);
        setLikeCount(likeCount + 1);
        await addLike(post.id);
      }
    } catch (error) {
      console.error('Beğeni işlemi sırasında bir hata oluştu:', error);
    }
  };

  const handleShowLikes = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showLikes) {
      await getPostLikes(post.id);
    }
    setIsLikesModalVisible(true);
  };

  const handleFollow = async (userId: string, isFollowing: boolean) => {
    try {
      // TODO: Implement follow/unfollow API call
      console.log(isFollowing ? 'Unfollow' : 'Follow', userId);
    } catch (error) {
      console.error('Takip işlemi sırasında bir hata oluştu:', error);
    }
  };

  const handleDeletePost = async () => {
    const isSuccess = await deletePost(post.id);
    setIsDeleteModalVisible(false);
    if(isSuccess){
      setErrorConfirmInfoModal(
        ERRORS.GENERIC_INFO_AND_ERRORS,
        "Başarılı",
        "Gönderi başarıyla silindi.",
        "success"
      );
    }
  };

  // Tarih formatını düzenleme
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const dropdownItems = [
    ...(post.isOwner ? [
      { key: '2', label: 'Sil' },
      { key: '3', label: 'Düzenle' }
    ] : [{ key: '1', label: 'Rapor Et' }])
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === '2') {
      setIsDeleteModalVisible(true);
    } else if (key === '1') {
      // Rapor Et modalını aç
      setIsReportModalVisible(true);
    }
  };

  const handleUserClick = () => {
    if(post.isOwner) {
      router.push("/profile");
      return;
    }
    router.push(`/users/${post.userId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-4 hover:shadow-xl transition-shadow">
      {/* Üst kısım - Kullanıcı bilgisi ve tarih */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar
            src={post.userProfileImage || undefined}
            size={40}
            onClick={handleUserClick}
            className="cursor-pointer"
          >
            {!post.userProfileImage &&
              post.userName.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div
              className="font-medium text-gray-800"
              onClick={handleUserClick}
            >
              <span className="cursor-pointer hover:underline font-bold">
                @{post.userName}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(post.postDate)}
            </div>
          </div>
        </div>
        <Dropdown
          menu={{
            items: dropdownItems,
            onClick: handleMenuClick,
          }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button type="text" onClick={(e) => e.stopPropagation()}>
            <Icon icon="mdi:dots-vertical" />
          </Button>
        </Dropdown>
      </div>

      {/* Metin içeriği - HTML render etme */}
      <div
        className="px-4 pb-3 text-gray-700 post-content cursor-pointer"
        onClick={handlePostClick}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Etkileşim butonları ve sayaçları */}
      <div className="px-4 py-4 flex justify-between border-t border-gray-100">
        <div className="flex items-center space-x-8">
          <div className="flex items-center cursor-pointer text-gray-500">
            <button
              onClick={handleLike}
              className="flex items-center text-gray-500 hover:text-red-500 transition-colors pr-1"
            >
              {liked ? (
                <Icon
                  icon="mdi:heart"
                  className="text-red-500 text-2xl mr-2"
                />
              ) : (
                <Icon
                  icon="mdi:heart-outline"
                  className="text-2xl mr-2"
                />
              )}
            </button>
            <span
              className="text-sm font-medium hover:underline"
              onClick={handleShowLikes}
            >
              {likeCount}
            </span>
          </div>

          <div
            className="flex items-center cursor-pointer text-gray-500"
            onClick={handlePostClick}
          >
            <Icon
              icon="mdi:message-outline"
              className="text-2xl mr-2"
            />
            <span className="text-sm font-medium">
              {post.commentCount}
            </span>
          </div>
        </div>
      </div>

      {/* Silme Onay Modalı */}
      <Modal
        title="Gönderiyi Sil"
        open={isDeleteModalVisible}
        onOk={handleDeletePost}
        onCancel={(e) => {
          e.stopPropagation();
          setIsDeleteModalVisible(false);
        }}
        okText="Sil"
        cancelText="İptal"
      >
        <p>
          Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem
          geri alınamaz.
        </p>
      </Modal>

      {/* Rapor Et Modalı */}
      <Modal
        title="Gönderiyi Raporla"
        open={isReportModalVisible}
        onOk={() => handleReportPost(reportReason)}
        onCancel={(e) => {
          e.stopPropagation();
          setIsReportModalVisible(false);
          setReportReason("");
        }}
        okText="Raporla"
        cancelText="İptal"
      >
        <p className="mb-3">Bu gönderiyi neden raporlamak istiyorsunuz?</p>
        <TextArea
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          placeholder="Rapor nedeninizi yazınız..."
          rows={4}
          className="w-full"
        />
      </Modal>

      {/* Beğeniler Modalı */}
      <LikesModal
        isVisible={isLikesModalVisible}
        onClose={() => setIsLikesModalVisible(false)}
        postId={post.id}
        onFollow={handleFollow}
      />
    </div>
  );
};

export default PostCard;
