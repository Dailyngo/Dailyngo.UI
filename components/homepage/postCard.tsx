"use client";

import { Avatar, Dropdown, Button, Modal } from 'antd';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store';
import { PostData } from '../../store/slices/postSlice';
import { LikeData } from '../../store/slices/likeSlice';
import { ERRORS } from '@/store/slices/errorSlice';

const PostCard: React.FC<{ post: PostData }> = ({ post }) => {
  const router = useRouter();
  const { 
    deletePost,
    getPostLikes,
    likes,
    addLike,
    removeLike,
	postError,
	setErrorConfirmInfoModal
  } = useStore();
  
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const handlePostClick = () => {
    router.push(`/posts/${post.id}`);
  };

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

    if(!post.isOwner) return;
    if (!showLikes) {
      await getPostLikes(post.id);
    }
    setShowLikes(!showLikes);
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
		await deletePost(post.id);
		setIsDeleteModalVisible(false);
		if(!postError){
			setErrorConfirmInfoModal(
				ERRORS.GENERIC_INFO_AND_ERRORS,
				"Hata",
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
    } else if (key === '3') {
      // Handle edit logic here
    }
  };

  const handleUserClick = () => {
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

			{/* Beğeniler Listesi */}
			{showLikes && likes[post.id] && (
				<div className="border-t border-gray-100 p-4">
					<h3 className="font-medium text-gray-800 mb-3">
						Beğenenler
					</h3>
					<div className="space-y-3">
						{likes[post.id].map((like: LikeData) => (
							<div
								key={like.userId}
								className="flex items-center justify-between"
							>
								<div className="flex items-center space-x-3">
									<Avatar size={32}>
										{like.fullName.charAt(0).toUpperCase()}
									</Avatar>
									<span className="font-medium text-gray-800">
										{like.fullName}
									</span>
								</div>
								<Button
									type={
										like.isFollowing ? "default" : "primary"
									}
									onClick={() =>
										handleFollow(
											like.userId,
											like.isFollowing
										)
									}
									className={
										like.isFollowing
											? "bg-gray-100 hover:bg-gray-200"
											: ""
									}
									size="small"
								>
									{like.isFollowing
										? "Takipten Çık"
										: "Takip Et"}
								</Button>
							</div>
						))}
					</div>
				</div>
			)}

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
		</div>
  );
};

export default PostCard;
