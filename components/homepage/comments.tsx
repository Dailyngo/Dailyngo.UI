"use client";

import { Avatar, Input, Button } from 'antd';
import { Icon } from '@iconify/react';
import { useState } from 'react';

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

interface CommentsProps {
  postId: string;
  comments: CommentData[];
  commentCount: number;
}

const Comments: React.FC<CommentsProps> = ({ postId, comments: initialComments, commentCount }) => {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyToUserName, setReplyToUserName] = useState<string | null>(null);

  // Yorumları ana yorumlar ve yanıtlar olarak gruplandırma
  const organizeComments = () => {
    const mainComments: CommentData[] = [];
    const replies: { [key: string]: CommentData[] } = {};

    // Önce ana yorumları ve yanıtları ayır
    comments.forEach(comment => {
      if (!comment.replyCommentId) {
        mainComments.push(comment);
      } else {
        if (!replies[comment.replyCommentId]) {
          replies[comment.replyCommentId] = [];
        }
        replies[comment.replyCommentId].push(comment);
      }
    });

    return { mainComments, replies };
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

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    setLoading(true);
    
    // Normalde burada API çağrısı yapılır
    // Şimdilik mock veri ekliyoruz
    const mockNewComment: CommentData = {
      id: `comment-${Date.now()}`,
      replyCommentId: replyTo || "",
      userId: 'current-user-id',
      userName: 'Siz',
      canDelete: true,
      content: newComment,
      commentDate: new Date().toISOString(),
      userProfileImage: null
    };
    
    // Yorumu ekle
    setComments([mockNewComment, ...comments]);
    // Input'u temizle
    setNewComment('');
    setReplyTo(null);
    setReplyToUserName(null);
    setLoading(false);
  };

  const handleDeleteComment = (commentId: string) => {
    // Yorumu ve tüm yanıtlarını sil
    const updatedComments = comments.filter(comment => 
      comment.id !== commentId && comment.replyCommentId !== commentId
    );
    setComments(updatedComments);
  };

  const handleReply = (commentId: string, userName: string) => {
    setReplyTo(commentId);
    setReplyToUserName(userName);
    // Yanıt yazma alanına odaklan
    document.getElementById('commentInput')?.focus();
  };

  const cancelReply = () => {
    setReplyTo(null);
    setReplyToUserName(null);
  };

  const { mainComments, replies } = organizeComments();

  return (
    <div className="border-t border-gray-100 pt-3">
      {/* Yorum giriş alanı */}
      <div className="px-4 mb-4 flex items-start">
        <Avatar size={32} className="mr-2 mt-1">
          S
        </Avatar>
        <div className="flex-1">
          {replyTo && (
            <div className="flex justify-between items-center bg-blue-50 p-2 rounded-t-lg text-sm mb-1">
              <span>
                <span className="text-blue-600 font-medium">{replyToUserName}</span>'a yanıt yazıyorsunuz
              </span>
              <button 
                onClick={cancelReply}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon icon="mdi:close" className="text-lg" />
              </button>
            </div>
          )}
          <Input.TextArea
            id="commentInput"
            placeholder={replyTo ? `${replyToUserName}'a yanıt yaz...` : "Yorum yaz..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 4 }}
            className={replyTo ? "rounded-b-xl rounded-t-none" : "rounded-xl"}
          />
          <div className="flex justify-end mt-2">
            <Button 
              type="primary" 
              onClick={handleCommentSubmit}
              loading={loading}
              disabled={!newComment.trim()}
              className="rounded-lg"
            >
              Gönder
            </Button>
          </div>
        </div>
      </div>

      {/* Yorumlar listesi */}
      <div className="px-4 pb-3">
        {comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            Henüz yorum yok
          </div>
        ) : (
          <div className="space-y-4">
            {mainComments.map((comment) => (
              <div key={comment.id}>
                {/* Ana yorum */}
                <div className="flex">
                  <Avatar 
                    src={comment.userProfileImage || undefined} 
                    size={32} 
                    className="mr-2 mt-1"
                  >
                    {comment.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{comment.userName}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.commentDate)}</span>
                      </div>
                      <p className="mt-1 text-sm">{comment.content}</p>
                    </div>
                    <div className="flex space-x-4 mt-1 ml-1">
                      <button 
                        className="text-xs text-gray-500 hover:text-blue-500"
                        onClick={() => handleReply(comment.id, comment.userName)}
                      >
                        Yanıtla
                      </button>
                      {comment.canDelete && (
                        <button 
                          className="text-xs text-gray-500 hover:text-red-500"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bu yoruma yapılan yanıtlar */}
                {replies[comment.id] && replies[comment.id].length > 0 && (
                  <div className="ml-10 mt-2 space-y-3">
                    {replies[comment.id].map(reply => (
                      <div key={reply.id} className="flex">
                        <Avatar 
                          src={reply.userProfileImage || undefined} 
                          size={28} 
                          className="mr-2 mt-1"
                        >
                          {reply.userName.charAt(0).toUpperCase()}
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between">
                              <span className="font-medium text-sm">{reply.userName}</span>
                              <span className="text-xs text-gray-500">{formatDate(reply.commentDate)}</span>
                            </div>
                            <p className="mt-1 text-sm">{reply.content}</p>
                          </div>
                          <div className="flex space-x-4 mt-1 ml-1">
                            <button 
                              className="text-xs text-gray-500 hover:text-blue-500"
                              onClick={() => handleReply(comment.id, reply.userName)}
                            >
                              Yanıtla
                            </button>
                            {reply.canDelete && (
                              <button 
                                className="text-xs text-gray-500 hover:text-red-500"
                                onClick={() => handleDeleteComment(reply.id)}
                              >
                                Sil
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments; 