import { Modal, Avatar, Button } from 'antd';
import { LikeData } from '../../store/slices/likeSlice';
import { useStore } from '@/store';
import { useState, useEffect } from 'react';
import { getTokenInfos } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

interface LikesModalProps {
    isVisible: boolean;
    onClose: () => void;
    postId: string;
    onFollow: (userId: string, isFollowing: boolean) => void;
}

const LikesModal: React.FC<LikesModalProps> = ({ 
    isVisible, 
    postId,
    onClose, 
    onFollow 
}) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [showLoadMore, setShowLoadMore] = useState(true);
    const loginUserDetail = getTokenInfos();
    const loginUserId = loginUserDetail?.sub;
    const router = useRouter();

    const {
        getPostLikes,
        likes
    } = useStore();

    useEffect(() => {
        if (isVisible) {
            setPageNumber(1);
            setShowLoadMore(true);
            getPostLikes(postId, 1);
        }
    }, [isVisible, postId]);

    const handleLoadMore = async () => {
        const newPageNumber = pageNumber + 1;
        const currentLikesCount = likes[postId]?.length || 0;
        
        await getPostLikes(postId, newPageNumber);
        
        const newLikesCount = likes[postId]?.length || 0;
        
        if (newLikesCount === currentLikesCount) {
            setShowLoadMore(false);
        }
        
        setPageNumber(newPageNumber);
    };

    const handleUserClick = (userId:string) => {
		router.push(`/users/${userId}`);
	};

    return (
		<Modal
			title="Beğenenler"
			open={isVisible}
			onCancel={onClose}
			footer={null}
			width={400}
		>
			<div className="space-y-3">
				{(likes[postId] ?? []).map((like: LikeData) => (
					<div
						key={like.userId}
						className="flex items-center justify-between"
					>
						<div
							className="flex items-center space-x-3 cursor-pointer"
							onClick={() => handleUserClick(like.userId)}
						>
							<Avatar size={32}>
								{like.fullName.charAt(0).toUpperCase()}
							</Avatar>
							<span className="font-medium text-gray-800">
								{like.fullName}
							</span>
						</div>
						{loginUserId !== like.userId ? (
							!like.isFollowing ? (
								<Button
									type={
										like.isFollowing ? "default" : "primary"
									}
									onClick={() =>
										onFollow(like.userId, like.isFollowing)
									}
									className={"bg-black text-white hover:bg-gray-800 border-black"}
									size="small"
								>
									Takip Et
								</Button>
							) : (
								<span className="text-gray-500 text-sm">
									Takiptesin
								</span>
							)
						) : (
							<span className="text-gray-500 text-sm">Siz</span>
						)}
					</div>
				))}
			</div>

			{showLoadMore ? (
				<div className="mt-6 text-center">
					<Button
						type="primary"
						onClick={handleLoadMore}
						size="small"
						className="w-32"
					>
						Daha Fazla Göster
					</Button>
				</div>
			) : (
				<div className="mt-6 text-center text-gray-500 text-sm">
					Beğeni listesi bu kadar
				</div>
			)}
		</Modal>
	);
};

export default LikesModal; 