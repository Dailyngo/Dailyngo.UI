"use client";

import { useEffect, useState } from 'react';
import { useStore } from '../../../../store';
import { useRouter } from 'next/navigation';
import Comments from '../../../../components/homepage/comments';
import { Avatar, Button } from 'antd';
import { Icon } from '@iconify/react';
import { PostData } from '@/store/slices/postSlice';
import { ERRORS } from '@/store/slices/errorSlice';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [liked, setLiked] = useState(selectedPost?.isLiked);
  const [likeCount, setLikeCount] = useState(selectedPost?.likeCount);
  const { 
	getPostDetailService,
    getPostComments, 
	postError,
    deleteComment,
    addLike,
    removeLike,
	setErrorConfirmInfoModal,
    comments
  } = useStore();

	useEffect(() => {
		const fetchPostDetail = async () => {
			const postDetail = await getPostDetailService(params.id);
			setSelectedPost(postDetail);
			if (!postDetail) {
				router.push('/');
				return;
			}
			setLiked(postDetail.isLiked);
			setLikeCount(postDetail.likeCount);
		};
		fetchPostDetail();
	}, [params.id]);


    useEffect(() => {
	  if (postError) {
		setErrorConfirmInfoModal(
		  ERRORS.GENERIC_INFO_AND_ERRORS,
		  "Hata",
		  postError,
		  "error"
		);
	  }
	}, [postError]);

	const handleLike = async (e: React.MouseEvent) => {
		e.stopPropagation(); 

		if (liked) {
			setLiked(false);
			setLikeCount((pre) => (pre ? pre - 1 : 0));
			await removeLike(params.id);
		} else {
			setLiked(true);
			setLikeCount((pre) => (pre ? pre + 1 : 1));
			await addLike(params.id);
		}
	};

	const handleDeleteComment = async (commentId: string) => {
			try {
				if (!selectedPost) return;

				const postId = params.id;

				await deleteComment(commentId, postId);
			} catch (error) {
				console.error("Yorum silinirken bir hata oluştu:", error);
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
								<span className="text-sm font-medium">
									{likeCount}
								</span>
							</div>

							<div className="flex items-center text-gray-500">
								<Icon
									icon="mdi:message-outline"
									className="text-2xl mr-2"
								/>
								<span className="text-sm font-medium">
									{selectedPost.commentCount}
								</span>
							</div>
						</div>
					</div>

					{/* Comments section */}
					{selectedPost && (
						<Comments
							postId={params.id}
							onDeleteComment={handleDeleteComment}
						/>
					)}
				</div>
			</div>
		</main>
  );
} 