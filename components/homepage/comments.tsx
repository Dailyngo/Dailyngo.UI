"use client";

import { Avatar, Input, Button } from 'antd';
import { Icon } from '@iconify/react';
import { use, useEffect, useState } from 'react';
import { CreateCommentData } from '@/store/slices/commentSlice';
import { useStore } from '../../store';
import { ERRORS } from '@/store/slices/errorSlice';
import { getTokenInfos } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

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
}

const Comments: React.FC<CommentsProps> = ({ postId}) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyToUserName, setReplyToUserName] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mainComments, setMainComments] = useState<CommentData[]>([]);
  const [replies, setReplies] = useState<{ [key: string]: CommentData[] }>({});
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [commentExists, setCommentExists] = useState(true);
  const [commentPage, setCommentPage] = useState(1);
  const [moreCommentLoading, setMoreCommentLoading] = useState(false);
  const router = useRouter();
  
  const {  
      createComment,
      getPostComments,
      deleteComment,
      commentError,
      setErrorConfirmInfoModal,
      comments,
      commentLoading
    } = useStore();

  // Yorumları ana yorumlar ve yanıtlar olarak gruplandırma
  const organizeComments = () => {
    const mainComments: CommentData[] = [];
    const replies: { [key: string]: CommentData[] } = {};

    // Önce ana yorumları ve yanıtları ayır
    (comments[postId] ?? []).forEach(comment => {
      if (!comment.replyCommentId) {
        mainComments.push(comment);
      } else {
        if (!replies[comment.replyCommentId]) {
          replies[comment.replyCommentId] = [];
        }
        replies[comment.replyCommentId].push(comment);
      }
    });

    setMainComments(mainComments);
    setReplies(replies);
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

  // Yorum gönderme işlemi\
  const onAddComment = async (content: string, replyToId?: string) => {
    try {
      const commentData: CreateCommentData = {
        content,
        postId: postId,
        replyCommentId: replyToId || null
      };
      
      await createComment(commentData);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Yorum eklenirken bir hata oluştu:', error);
      return Promise.reject(error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    
    try {
      await onAddComment(newComment);
      setNewComment('');
      setReplyTo(null);
      setReplyToUserName(null);
      await getPostComments(postId, 1);
    } catch (error) {
      console.error('Yorum gönderilirken bir hata oluştu:', error);
    }
  };

 
  const handleDeleteComment = async (commentId: string) => {
		const isSuccess = await deleteComment(commentId, postId);
    if(isSuccess){
      setErrorConfirmInfoModal(
        ERRORS.GENERIC_INFO_AND_ERRORS,
        "Hata",
        "Yorum Başarılı bir şekilde silindi.",
        "success"
      );
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !replyTo) return;
    
    try {
      setSubmitting(true);
      await onAddComment(replyContent, replyTo);
      setReplyContent('');
      setReplyTo(null);
    } catch (error) {
      console.error('Yanıt eklenirken bir hata oluştu:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartReply = (commentId: string, userName: string) => {
    setReplyTo(commentId);
    setReplyToUserName(userName);
  };

  const cancelReply = () => {
    setReplyTo(null);
    setReplyToUserName(null);
    setReplyContent('');
  };

  useEffect(() => {
    console.log('YEni YOrumlar:', comments[postId]);
    setCommentExists((comments[postId] || []).length > 0);
    organizeComments();
  }, [comments]);

  useEffect(() => {
    loadComments(1);
  },[postId]);

  useEffect(() => {
    if (commentError) {
        setErrorConfirmInfoModal(
          ERRORS.GENERIC_INFO_AND_ERRORS,
          "Hata",
          commentError,
          "success"
          );
    }
  }, [commentError]);

  const loadComments = async (pageNumber: number | null) => {
      setMoreCommentLoading(true);
      const newComments = await getPostComments(postId,pageNumber || 1);
      setHasMoreComments(newComments.length > 0);
      setMoreCommentLoading(false);
      return newComments;
  };

	const handleLoadMoreCommentsClick = async (e: React.MouseEvent) => {
		e.stopPropagation();
		await handleLoadMoreComments();
	}

	const handleLoadMoreComments = async () => {
		const newPage = commentPage + 1;
		const oldLength = comments[postId].length;
		const newComments = await loadComments(newPage);
		setCommentPage(newPage);
		setHasMoreComments(newComments ? newComments.length > 0  && oldLength !== newComments.length : false);
	};

  const getLoginUsername = () => {
      const loginUserDetail = getTokenInfos();
      const loginUserName = loginUserDetail?.username;
      return loginUserName;
  }

  const handleUserClick = (userId : string) => {
    router.push(`/users/${userId}`);
  };

  return (
		<div className="border-t border-gray-100 pt-3">
			{/* Yorum giriş alanı */}
			<div className="px-4 mb-4 flex items-start">
				<Avatar size={32} className="mr-2 mt-1">
					{getLoginUsername()
						? getLoginUsername().charAt(0).toUpperCase()
						: "U"}
				</Avatar>
				<div className="flex-1">
					{replyTo ? (
						<div className="flex items-start mb-3">
							<div className="flex-1">
								<div className="flex justify-between items-center bg-blue-50 p-2 rounded-t-lg text-sm">
									<span>
										<span className="text-blue-600 font-medium">
											{replyToUserName}
										</span>
										'a yanıt yazıyorsunuz
									</span>
									<button
										onClick={cancelReply}
										className="text-gray-500 hover:text-gray-700"
									>
										<Icon
											icon="mdi:close"
											className="text-lg"
										/>
									</button>
								</div>
								<Input.TextArea
									placeholder="Yanıtınızı yazın..."
									value={replyContent}
									onChange={(e) =>
										setReplyContent(e.target.value)
									}
									autoSize={{ minRows: 1, maxRows: 4 }}
									className="rounded-b-xl rounded-t-none"
								/>
								<div className="flex justify-end mt-2">
									<Button
										type="primary"
										onClick={handleReply}
										loading={submitting}
										disabled={!replyContent.trim()}
										className="rounded-lg"
									>
										Yanıtla
									</Button>
								</div>
							</div>
						</div>
					) : (
						<>
							<Input.TextArea
								id="commentInput"
								placeholder="Yorum yaz..."
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								autoSize={{ minRows: 1, maxRows: 4 }}
								className="rounded-xl"
							/>
							<div className="flex justify-end mt-2">
								<Button
									type="primary"
									onClick={handleCommentSubmit}
									loading={commentLoading}
									disabled={!newComment.trim()}
									className="rounded-lg"
								>
									Gönder
								</Button>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Yorumlar listesi */}
			<div className="px-4 pb-3">
				{(comments[postId] ?? []).length === 0 ? (
					<div className="text-center py-4 text-gray-500 text-sm">
						Henüz yorum yok. İlk yorumu siz yapın!
					</div>
				) : (
					<div className="space-y-4">
						{mainComments.map((comment) => (
							<div key={comment.id}>
								{/* Ana yorum */}
								<div className="flex">
									<Avatar
										src={
											comment.userProfileImage ||
											undefined
										}
										size={32}
										className="mr-2 mt-1 cursor-pointer"
										onClick={() => handleUserClick(comment.userId) }
									>
										{comment.userName
											.charAt(0)
											.toUpperCase()}
									</Avatar>
									<div className="flex-1">
										<div className="bg-gray-50 p-3 rounded-lg">
											<div className="flex justify-between">
												<div className='cursor-pointer' onClick={() => handleUserClick(comment.userId) }>
                          <span className="cursor-pointer hover:underline font-bold text-sm">
                            @{comment.userName}
                          </span>
                        </div>
												<span className="text-xs text-gray-500">
													{formatDate(
														comment.commentDate
													)}
												</span>
											</div>
											<p className="mt-1 text-sm">
												{comment.content}
											</p>
										</div>
										<div className="flex space-x-4 mt-1 ml-1">
											<button
												className="text-xs text-gray-500 hover:text-blue-500"
												onClick={() =>
													handleStartReply(
														comment.id,
														comment.userName
													)
												}
											>
												Yanıtla
											</button>
											{comment.canDelete && (
												<button
													className="text-xs text-gray-500 hover:text-red-500"
													onClick={() =>
														handleDeleteComment(
															comment.id
														)
													}
												>
													Sil
												</button>
											)}
										</div>
									</div>
								</div>

								{/* Bu yoruma yapılan yanıtlar */}
								{replies[comment.id] &&
									replies[comment.id].length > 0 && (
										<div className="ml-10 mt-2 space-y-3">
											{replies[comment.id].map(
												(reply) => (
													<div
														key={reply.id}
														className="flex"
													>
														<Avatar
															src={
																reply.userProfileImage ||
																undefined
															}
															size={28}
															className="mr-2 mt-1"
														>
															{reply.userName
																.charAt(0)
																.toUpperCase()}
														</Avatar>
														<div className="flex-1">
															<div className="bg-gray-50 p-3 rounded-lg">
																<div className="flex justify-between">
																	<span className="font-medium text-sm">
																		{
																			reply.userName
																		}
																	</span>
																	<span className="text-xs text-gray-500">
																		{formatDate(
																			reply.commentDate
																		)}
																	</span>
																</div>
																<p className="mt-1 text-sm">
																	{
																		reply.content
																	}
																</p>
															</div>
															<div className="flex space-x-4 mt-1 ml-1">
																<button
																	className="text-xs text-gray-500 hover:text-blue-500"
																	onClick={() =>
																		handleStartReply(
																			comment.id,
																			reply.userName
																		)
																	}
																>
																	Yanıtla
																</button>
																{reply.canDelete && (
																	<button
																		className="text-xs text-gray-500 hover:text-red-500"
																		onClick={() =>
																			handleDeleteComment(
																				reply.id
																			)
																		}
																	>
																		Sil
																	</button>
																)}
															</div>
														</div>
													</div>
												)
											)}
										</div>
									)}
							</div>
						))}
					</div>
				)}
			</div>

			{moreCommentLoading ? (
				<div className="flex justify-center items-center py-4 border-t border-gray-100">
					<Icon icon="line-md:loading-loop" width="24" height="24" />
				</div>
			) : (
				<>
					{commentExists &&
						(hasMoreComments ? (
							<div className="text-center m-4">
								<Button
									type="primary"
									onClick={handleLoadMoreCommentsClick}
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
  );
};

export default Comments; 