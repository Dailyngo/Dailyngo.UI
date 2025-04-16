"use client";

import { Avatar, Dropdown, Button, Modal } from 'antd';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import Comments from './comments';
import { useStore } from '../../store';
import { PostData } from '../../store/slices/postSlice';
import { CommentData, CreateCommentData } from '../../store/slices/commentSlice';
// import { createCommentService, getPostCommentsService, deleteCommentService } from '@/services';

const PostCard: React.FC<{ post: PostData }> = ({ post }) => {
  const { 
    deletePost, 
    getPostComments, 
    deleteComment,
    comments,
    loading: commentLoading
  } = useStore();
  
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  
  // Yorumları yükle
  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments, post.id]);
  
  // Store'dan yorumları getir
  const loadComments = async () => {
    const result = await getPostComments(post.id);
    // Yorum sayısını güncelle
    if (result.length !== commentCount) {
      setCommentCount(result.length);
    }
  };

  
  // Yorum sil
  const handleDeleteComment = async (commentId: string) => {
    try {
      // Silinen yorumu ve yanıtlarını bul
      const postComments = comments[post.id] || [];
      const commentToDelete = postComments.find(c => c.id === commentId);
      const isMainComment = commentToDelete && !commentToDelete.replyCommentId;
      
      // Silinecek yanıtları bul
      const replies = postComments.filter(c => c.replyCommentId === commentId);
      
      // Toplam silinecek yorum sayısı
      const deleteCount = 1 + (isMainComment ? replies.length : 0);
      
      // Yorumu sil
      await deleteComment(commentId, post.id);
      
      // Yorum sayısını güncelle
      setCommentCount(prev => prev - deleteCount);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Yorum silinirken bir hata oluştu:', error);
      return Promise.reject(error);
    }
  };

  const handleLike = () => {
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

  // Mevcut gönderi için yorumları al
  const postComments = comments[post.id] || [];

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
      
      {/* Etkileşim butonları ve sayaçları */}
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
            <span className="text-sm font-medium">{commentCount}</span>
          </button>
        </div>
      </div>

      {/* Yorumlar bölümü */}
      {showComments && (
        <>
          {commentLoading ? (
            <div className="flex justify-center items-center py-4 border-t border-gray-100">
              <Icon icon="line-md:loading-loop" width="24" height="24" />
            </div>
          ) : (
            <Comments 
              postId={post.id} 
              comments={postComments} 
              onDeleteComment={handleDeleteComment}
            />
          )}
        </>
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
