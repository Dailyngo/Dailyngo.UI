"use client";

import { useEffect, useState } from 'react';
import { useStore } from '../../../../store';
import { useRouter } from 'next/navigation';
import Comments from '../../../../components/homepage/comments';
import { Avatar, Button, Dropdown, Modal } from 'antd';
import { Icon } from '@iconify/react';
import { PostData } from '@/store/slices/postSlice';
import { ERRORS } from '@/store/slices/errorSlice';
import LikesModal from '../../../../components/ui/LikesModal';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
  const [liked, setLiked] = useState(selectedPost?.isLiked);
  const [likeCount, setLikeCount] = useState(selectedPost?.likeCount);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLikesModalVisible, setIsLikesModalVisible] = useState(false);

  const { 
	getPostDetailService,
    deletePost,
	postError,
    addLike,
    removeLike,
	setErrorConfirmInfoModal,
	getPostLikes,
	likes
  } = useStore();

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
	useEffect(() => {
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

	const handleShowLikes = async (e: React.MouseEvent) => {
		e.stopPropagation();
		await getPostLikes(params.id);
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
	
	const handleUserClick = () => {
		router.push(`/users/${selectedPost.userId}`);
	};

	const dropdownItems = [
		...(selectedPost.isOwner ? [
			{ key: '2', label: 'Sil' },
			{ key: '3', label: 'Düzenle' }
		] : [{ key: '1', label: 'Rapor Et' }])
	];

	const handleMenuClick = ({ key }: { key: string }) => {
		if (key === '2') {
			setIsDeleteModalVisible(true);
		} else if (key === '3') {
			// Handle edit logic here
		}
	};

	const handleDeletePost = async () => {
		const isSuccess = await deletePost(selectedPost.id);
		setIsDeleteModalVisible(false);
		if(isSuccess){
			setErrorConfirmInfoModal(
				ERRORS.GENERIC_INFO_AND_ERRORS,
				"Hata",
				"Gönderi başarıyla silindi.",
				"success"
				);
		}
		router.push('/');
	};

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
								onClick={handleUserClick}
								className="cursor-pointer"
							>
								{!selectedPost.userProfileImage &&
									selectedPost.userName
										.charAt(0)
										.toUpperCase()}
							</Avatar>
							<div>
								<div
									className="font-medium text-gray-800"
									onClick={handleUserClick}
								>
									<span className="cursor-pointer hover:underline font-bold">
										@{selectedPost.userName}
									</span>
								</div>
								<div className="text-xs text-gray-500">
									{formatDate(selectedPost.postDate)}
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
								<span
									className="text-sm font-medium hover:underline cursor-pointer"
									onClick={handleShowLikes}
								>
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
							handleSelectedPostDetail={fetchPostDetail}
						/>
					)}
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

			{/* Beğeniler Modalı */}
			<LikesModal
				isVisible={isLikesModalVisible}
				onClose={() => setIsLikesModalVisible(false)}
				postId={params.id}
				onFollow={handleFollow}
			/>
		</main>
  );
} 