"use client";

import { useEffect, useState } from 'react';
import { useStore } from '../../../../store';
import { useRouter } from 'next/navigation';
import Comments from '../../../../components/homepage/comments';
import { Avatar, Dropdown, Button } from 'antd';
import { Icon } from '@iconify/react';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [commentExists, setCommentExists] = useState(true);

  const { 
    selectedPost,
    getPostComments, 
    deleteComment,
    comments,
    loading: commentLoading
  } = useStore();

  useEffect(() => {
    if (!selectedPost) {
      router.push('/'); // If no post is selected, redirect to home
      return;
    }
    loadComments();
  }, [selectedPost, params.id]);

  useEffect(() => {
    setCommentExists((comments[params.id] || []).length > 0);
  },[comments])

  const loadComments = async () => {
    if (selectedPost) {
      const comments = await getPostComments(selectedPost.id);
      setHasMoreComments(comments.length > 0);
    }
  };

  const handleLoadMoreComments = async () => {
    const newPage = commentPage + 1;
    const newComments = await getPostComments(params.id);
    setCommentPage(newPage);
    setHasMoreComments(newComments.length > 0);
  };


  const handleDeleteComment = async (commentId: string) => {
    try {
      if (!selectedPost) return;
      
      // Yorum silme işlemi
      const postId = params.id;
      const commentIndex = comments[postId].findIndex(
        (comment: any) => comment.id === commentId
      );

      if (commentIndex === -1) {
        console.error('Yorum bulunamadı:', commentId);
        return Promise.reject(new Error('Yorum bulunamadı'));
      }

      // Yorum silindikten sonra state güncelleniyor
      const updatedComments = [...comments[postId]];
      updatedComments.splice(commentIndex, 1);

      comments[postId] = updatedComments;
      setCommentExists(updatedComments.length > 0);

      await deleteComment(commentId,postId); 
      
    } catch (error) {
      console.error('Yorum silinirken bir hata oluştu:', error);
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

  if (!selectedPost) {
    return null;
  }

  return (
		<main className="py-6 px-4 bg-gray-100 min-h-screen">
			<div className="w-full max-w-2xl mx-auto md:w-2/3 lg:w-1/2">
				<div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-4">
					{/* Post header */}
					<div className="p-4 flex justify-between items-center">
						<div className="flex items-center space-x-3">
							<Avatar
								src={selectedPost.userProfileImage || undefined}
								size={40}
							>
								{!selectedPost.userProfileImage &&
									selectedPost.userName
										.charAt(0)
										.toUpperCase()}
							</Avatar>
							<div>
								<div className="font-medium text-gray-800">
									{selectedPost.userName}
								</div>
								<div className="text-xs text-gray-500">
									{formatDate(selectedPost.postDate)}
								</div>
							</div>
						</div>
						<Button
							type="text"
							onClick={() => router.push("/")}
							icon={<Icon icon="mdi:close" />}
						/>
					</div>

					{/* Post content */}
					<div
						className="px-4 pb-3 text-gray-700 post-content"
						dangerouslySetInnerHTML={{
							__html: selectedPost.content,
						}}
					/>

					{/* Post stats */}
					<div className="px-4 py-4 flex justify-between border-t border-gray-100">
						<div className="flex items-center space-x-8">
							<div className="flex items-center text-gray-500">
								<Icon
									icon={
										selectedPost.isLiked
											? "mdi:heart"
											: "mdi:heart-outline"
									}
									className={`text-2xl mr-2 ${
										selectedPost.isLiked
											? "text-red-500"
											: ""
									}`}
								/>
								<span className="text-sm font-medium">
									{selectedPost.likeCount}
								</span>
							</div>

							<div className="flex items-center text-gray-500">
								<Icon
									icon="mdi:message-outline"
									className="text-2xl mr-2"
								/>
								<span className="text-sm font-medium">
									{(comments[params.id] || []).length}
								</span>
							</div>
						</div>
					</div>

					{/* Comments section */}
					{commentLoading ? (
						<div className="flex justify-center items-center py-4 border-t border-gray-100">
							<Icon
								icon="line-md:loading-loop"
								width="24"
								height="24"
							/>
						</div>
					) : (
						<>
							<Comments
								postId={params.id}
								comments={comments[params.id] || []}
								onDeleteComment={handleDeleteComment}
							/>
							{commentExists &&
								(hasMoreComments ? (
									<div className="text-center m-4">
										<Button
											type="primary"
											onClick={handleLoadMoreComments}
											loading={commentLoading}
										>
											Daha Fazla Yükle
										</Button>
									</div>
								) : (
									<div className="text-center m-4 text-gray-500">
										Yorumların sonuna geldin.
									</div>
								))}
						</>
					)}
				</div>
			</div>
		</main>
  );
} 