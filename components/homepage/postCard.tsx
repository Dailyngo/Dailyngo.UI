"use client";

import { Avatar, Dropdown, Button, Modal } from 'antd';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import Comments from './comments';
import { useStore } from '../../store';
import { PostData } from '../../store/slices/postSlice';

// Yorum veri yapısı - API'den gelen yapıya uygun
interface CommentData {
  id: string;
  replyCommentId: string;
  userId: string;
  userName: string;
  canDelete: boolean;
  content: string;
  commentDate: string;
  userProfileImage?: string | null;
}

const PostCard: React.FC<{ post: PostData }> = ({ post }) => {
  const { deletePost } = useStore();
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  // Mock yorumlar - API formatına uygun
  const mockComments: CommentData[] = [
    {
      id: "67fbbff6d2511bd6e1acc466",
      replyCommentId: "",
      userId: "af2c2db3-7572-4c2b-bd83-6a0ac7fad50f",
      userName: "admin",
      canDelete: true,
      content: "Harika gorunuyor",
      commentDate: "2025-04-13T13:45:26.0020431+00:00",
      userProfileImage: null
    },
    {
      id: "67fbbff6d2511bd6e1acc467",
      replyCommentId: "67fbbff6d2511bd6e1acc466",
      userId: "bf3c3db3-8672-4c2b-bd83-7b1ac7fad60g",
      userName: "mehmet.yilmaz",
      canDelete: false,
      content: "Bu paylaşım tam olarak aradığım şeydi, teşekkürler!",
      commentDate: "2025-04-13T12:30:15.0020431+00:00",
      userProfileImage: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    {
      id: "67fbbff6d2511bd6e1acc468",
      replyCommentId: "67fbbff6d2511bd6e1acc467",
      userId: "cf4c4db3-9772-4c2b-bd83-8c2ac7fad70h",
      userName: "ayse.demir",
      canDelete: false,
      content: "Katılıyorum, gerçekten faydalı olmuş.",
      commentDate: "2025-04-13T14:15:20.0020431+00:00",
      userProfileImage: "https://randomuser.me/api/portraits/women/24.jpg"
    }
  ];

  const handleLike = () => {
    // Artık store'dan likePost kullanmıyoruz, lokal state kullanıyoruz
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id);
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error('Gönderi silinirken bir hata oluştu:', error);
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

  const isCurrentUserPost = post.userId === 'current-user-id'; // Gerçek uygulamada mevcut kullanıcının ID'sine göre kontrol edilmeli

  const dropdownItems = [
    { key: '1', label: 'Rapor Et' },
    { key: '2', label: 'Sil' },
    { key: '3', label: 'Düzenle' }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === '2') {
      setIsDeleteModalVisible(true);
    } else if (key === '3') {
      // Handle edit logic here
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
      {/* Üst kısım - Kullanıcı bilgisi ve tarih */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={post.userProfileImage || undefined} 
            size={40}
          >
            {!post.userProfileImage && post.userName.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div className="font-medium text-gray-800">{post.userName}</div>
            <div className="text-xs text-gray-500">{formatDate(post.postDate)}</div>
          </div>
        </div>
        <Dropdown 
          menu={{ 
            items: dropdownItems,
            onClick: handleMenuClick
          }}
          placement="bottomRight"
        >
          <Button type="text">
            <Icon icon="mdi:dots-vertical" />
          </Button>
        </Dropdown>
      </div>
      
      {/* Metin içeriği - HTML render etme */}
      <div 
        className="px-4 pb-3 text-gray-700 post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {/* Etkileşim butonları ve sayaçları birleştirilmiş - Büyütülmüş */}
      <div className="px-4 py-4 flex justify-between border-t border-gray-100">
        <div className="flex items-center space-x-8">
          <button 
            onClick={handleLike}
            className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
          >
            {liked ? (
              <Icon icon="mdi:heart" className="text-red-500 text-2xl mr-2" />
            ) : (
              <Icon icon="mdi:heart-outline" className="text-2xl mr-2" />
            )}
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          
          <button 
            onClick={toggleComments}
            className={`flex items-center transition-colors ${showComments ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
          >
            <Icon icon="mdi:message-outline" className="text-2xl mr-2" />
            <span className="text-sm font-medium">{post.commentCount}</span>
          </button>
        </div>
      </div>

      {/* Yorumlar bölümü */}
      {showComments && (
        <Comments 
          postId={post.id} 
          comments={mockComments} 
          commentCount={post.commentCount} 
        />
      )}

      {/* Silme Onay Modalı */}
      <Modal
        title="Gönderiyi Sil"
        open={isDeleteModalVisible}
        onOk={handleDeletePost}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Sil"
        cancelText="İptal"
      >
        <p>Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
      </Modal>
    </div>
  );
};

export default PostCard;
