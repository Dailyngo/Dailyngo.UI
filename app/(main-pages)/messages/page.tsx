"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, Input, Button, List, Badge, AutoComplete } from "antd";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { Message, MessageUser } from "@/store/slices/chatMessagesSlice";
import { SignalRHelper } from "@/lib/utils";
import { useStore } from "@/store";

// Add this interface at the top of the file
interface SearchOption {
	value: string;
	label: string;
}

// Utility functions for date formatting
const formatMessageDate = (dateString: string): string => {
	const date = new Date(dateString);
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (days === 0) {
		return date.toLocaleTimeString("tr-TR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	}
	else if (days === 1) {
		return (
			"Dün " +
			date.toLocaleTimeString("tr-TR", {
				hour: "2-digit",
				minute: "2-digit",
			})
		);
	}
	else if (days < 7) {
		return date.toLocaleDateString("tr-TR", {
			weekday: "long",
			hour: "2-digit",
			minute: "2-digit",
		});
	}
	else {
		return date.toLocaleDateString("tr-TR", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	}
};

const escapeHtml = (text: string) => {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
};

// Modify the read status formatting for messages older than 7 days
const formatReadStatus = (user: MessageUser): string => {
	// If I am the sender of the last message (lastMessageOwner is true)
	if (user.lastMessageOwner) {
		// If message has been read (lastMessageReadDate is not null)
		if (user.lastMessageReadDate) {
			const now = new Date();
			const readDate = new Date(user.lastMessageReadDate);
			const diffMs = now.getTime() - readDate.getTime();
			const diffMinutes = Math.floor(diffMs / (1000 * 60));
			const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
			const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

			// Within the first minute
			if (diffMinutes < 1) {
				return "Az önce görüldü";
			}
			// Within the first hour
			else if (diffHours < 1) {
				return `${diffMinutes} dk önce görüldü`;
			}
			// Within 24 hours
			else if (diffDays < 1) {
				return `${diffHours} saat önce görüldü`;
			}
			// Within a week
			else if (diffDays < 7) {
				return `${diffDays} gün önce görüldü`;
			}
			// More than a week - just show "Görüldü"
			else {
				return "Görüldü";
			}
		}
		// Message has not been read yet
		else {
			return "Gönderildi";
		}
	}
	
	// If I'm not the sender of the last message, don't show any read status
	return "";
};

const Messages = () => {
	const [selectedUser, setSelectedUser] = useState<MessageUser | null>(null);
	const [messageInput, setMessageInput] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [receiveMessage, setReceiveMessage] = useState<any>(null);
	const [signalRConnection, setSignalRConnection] = useState<any>(null);
	const [searchResults, setSearchResults] = useState<SearchOption[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [debounceTimeout, setDebounceTimeout] =
		useState<NodeJS.Timeout | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const loaderRef = useRef(null);
	const [showScrollToBottom, setShowScrollToBottom] = useState(false);
	const [newMessageCount, setNewMessageCount] = useState(0);
	const [showLoadMore, setShowLoadMore] = useState(false);
	const [isNearBottom, setIsNearBottom] = useState(true);
	const [userPage, setUserPage] = useState<number>(1);
	const [canLoadMoreUsers, setCanLoadMoreUsers] = useState<boolean>(true);
	const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [imageError, setImageError] = useState<string | null>(null);
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [modalImage, setModalImage] = useState<string | null>(null);

	const {
		userMessages,
		messageUsers,
		searchUsers,
		getSearchUsers,
		messageLoading,
		getAllMessages,
		getAllUsersMessage,
		setNewUserMessages,
	} = useStore();

	const scrollToBottom = (smooth = true) => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({
				behavior: smooth ? "smooth" : "auto",
				block: "end",
			});
		}
	};

	useEffect(() => {
		const signalRHelper = new SignalRHelper("message-hub");
		setSignalRConnection(signalRHelper);
		signalRHelper.startConnection();

		signalRHelper.on("ReceiveMessage", async (message: any) => {
			setReceiveMessage(message);
		});

		return () => {
			signalRHelper.stopConnection();
		};
	}, []);

	useEffect(() => {
		if (receiveMessage && selectedUser) {
			const userId = receiveMessage.senderId;
			const newMessage: Message = {
				id: receiveMessage.messageId,
				content: receiveMessage.message,
				createdAt: receiveMessage.sendDate,
				isOwner: false,
			};
			setNewUserMessages(userId, newMessage);
			
			// Only update message count if the message is from the current selected user
			// and we are scrolled up and not already at the bottom
			if (selectedUser.userId === userId && messagesContainerRef.current) {
				const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
				const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
				
				// Only increment if we're actually away from the bottom
				if (distanceFromBottom > 50) {
					setNewMessageCount(prev => prev + 1);
				}
			}
			
			// Auto-scroll only if we're near bottom and it's the current user's message
			if (isNearBottom && selectedUser.userId === userId) {
				setNewMessageCount(0);
				setTimeout(() => {
					scrollToBottom();
				}, 100);
			}
		}
	}, [receiveMessage, selectedUser]);

	useEffect(() => {
		getAllUsersMessageHandler();
	}, []);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [selectedUser]);

	useEffect(() => {
		if (searchUsers?.length) {
			const formattedResults = searchUsers.map((user) => ({
				value: user.id,
				label: user.fullName,
			}));
			setSearchResults(formattedResults);
		} else {
			setSearchResults([]);
		}
	}, [searchUsers]);

	useEffect(() => {
		setCurrentPage(1);
		setCanLoadMore(true);
	}, [selectedUser]);

	const getAllUsersMessageHandler = async (page: number = 1) => {
		setLoadingUsers(true);
		try {
			await getAllUsersMessage(page);
			setUserPage(page);
			
			// Check if we can load more users
			// If the API returns fewer than 40 users, we've reached the end
			const currentUsersList = messageUsers;
			if (page === 1) {
				// For first page, check if total users < 40
				setCanLoadMoreUsers(currentUsersList.length === 40);
			} else {
				// For subsequent pages, check if we got a full page of results
				const previousTotal = (page - 1) * 40;
				const newlyLoadedCount = currentUsersList.length - previousTotal;
				if (newlyLoadedCount < 40) {
					setCanLoadMoreUsers(false);
				}
			}
		} finally {
			setLoadingUsers(false);
		}
	};

	const joinChat = async (userId: string) => {
		await signalRConnection.invoke("JoinChat", userId);
	}

	const leaveChat = async (userId: string) => {
		await signalRConnection.invoke("LeaveChat", userId);
	}


	const getAllMessagesHandler = async (
		userId: string,
		pageNumber?: number | null
	) => {
		await getAllMessages(userId, pageNumber ?? 1);
	};

	const handleUserClick = async (user: MessageUser) => {
		// If there's a previously selected user, leave that chat
		if (selectedUser) {
			await leaveChat(selectedUser.userId);
		}
		
		setCurrentPage(1);
		setCanLoadMore(true);
		await getAllMessagesHandler(user.userId, 1);
		setSelectedUser(user);
		
		// Join the new user's chat
		await joinChat(user.userId);
	};

	// Update handleSendMessage to format all content as HTML
	const handleSendMessage = async () => {
		if ((!messageInput.trim() && !selectedImage) || !selectedUser) return;

		try {
			let htmlContent = "";

			if (messageInput.trim()) {
				const escapedText = escapeHtml(messageInput.trim());
				const formattedText = escapedText.replace(/\n/g, "<br>");
				htmlContent += `<p style="margin:0 0 8px 0;">${formattedText}</p>`;
			}

			if (selectedImage) {
				const imageData = await new Promise<string>((resolve) => {
					const reader = new FileReader();
					reader.onloadend = () => {
						resolve(reader.result as string);
					};
					reader.readAsDataURL(selectedImage);
				});
				
				htmlContent += `
					<div class="message-image-container" style="margin-top:8px; text-align:center;">
						<img 
							src="${imageData}" 
							alt="Mesaj görseli" 
							style="max-width:100%; max-height:200px; border-radius:8px; cursor:pointer; display:inline-block;"
							onclick="event.preventDefault(); event.stopPropagation(); document.dispatchEvent(new CustomEvent('openImageModal', {detail: '${imageData}'})); return false;"
						/>
					</div>
				`;
			}

			await signalRConnection.invoke(
				"SendMessage",
				selectedUser.userId,
				htmlContent
			);

			setMessageInput("");
			setSelectedImage(null);
			setImagePreview(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}

			await getAllMessagesHandler(selectedUser.userId, 1);
			setCurrentPage(1);
			setCanLoadMore(true);
			scrollToBottom(true);
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	const handleSearch = async (value: string) => {
		if (value.trim().length >= 2) {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
			const timeout = setTimeout(() => {
				getSearchUsers(value.trim(), 1);
			}, 500);

			setDebounceTimeout(timeout);
		} else {
			setSearchResults([]);
		}
	};

	const handleSearchSelect = (userId: string, option: { label: string }) => {
		const selectedSearchUser: MessageUser = {
			userId: userId,
			fullName: option.label,
			unreadCount: 0,
			lastMessageDate: new Date().toISOString(),
			lastMessage: "",
			lastMessageOwner: false,
			lastMessageReadDate: null,
		};

		setSelectedUser(selectedSearchUser);
		setSearchInput("");
		setSearchResults([]);
	};

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [target] = entries;
			if (
				target.isIntersecting &&
				!messageLoading &&
				canLoadMore &&
				selectedUser
			) {
				setShowLoadMore(true);
			}
		},
		[messageLoading, canLoadMore, selectedUser]
	);

	useEffect(() => {
		const observer = new IntersectionObserver(handleObserver, {
			root: null,
			rootMargin: "20px",
			threshold: 0.1,
		});

		const currentLoader = loaderRef.current;

		if (currentLoader && selectedUser) {
			observer.observe(currentLoader);
		}

		return () => {
			if (currentLoader) {
				observer.unobserve(currentLoader);
			}
		};
	}, [handleObserver, selectedUser]);

	useEffect(() => {
		const calculateAverageMessageHeight = () => {
			const messageElements = document.querySelectorAll('.message-item');
			if (messageElements.length > 0) {
				const totalHeight = Array.from(messageElements).reduce((sum, el) => sum + el.clientHeight, 0);
				return totalHeight / messageElements.length;
			}
			return 80;
		};

		const handleScroll = () => {
			if (messagesContainerRef.current && selectedUser) {
				const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
				const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
				const avgHeight = calculateAverageMessageHeight();
				
				const isScrolledUp = distanceFromBottom > (avgHeight * 5);
				setIsNearBottom(!isScrolledUp);
				setShowScrollToBottom(isScrolledUp && selectedUser !== null);
				
				if (distanceFromBottom < 10) {
					setNewMessageCount(0);
				}
				
				const isNearTop = scrollTop < 50;
				setShowLoadMore(isNearTop && canLoadMore);
			}
		};

		const container = messagesContainerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll);
			}
		};
	}, [canLoadMore, selectedUser]);

	const loadMoreMessages = async () => {
		if (!selectedUser || messageLoading) return;
		
		await getAllMessagesHandler(selectedUser.userId, currentPage + 1);
		setCurrentPage(prev => prev + 1);
		
		if (userMessages[selectedUser.userId].length % 40 !== 0) {
			setCanLoadMore(false);
			setShowLoadMore(false);
		}
	};

	const loadMoreUsers = async () => {
		if (loadingUsers) return;
		await getAllUsersMessageHandler(userPage + 1);
	};

	useEffect(() => {
		setUserPage(1);
		setCanLoadMoreUsers(true);
		getAllUsersMessageHandler(1);
	}, []);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setImageError(null);
		
		if (file) {
			const maxSize = 2 * 1024 * 1024;
			
			if (file.size > maxSize) {
				setImageError("Görsel boyutu 2MB'dan küçük olmalıdır.");
				setSelectedImage(null);
				setImagePreview(null);
				if (fileInputRef.current) {
					fileInputRef.current.value = '';
				}
				return;
			}
			
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onload = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const removeSelectedImage = () => {
		setSelectedImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	// Make openImageModal depend on the dependency array
	const openImageModal = useCallback((imageUrl: string) => {
		setModalImage(imageUrl);
		setIsImageModalOpen(true);
	}, []);

	// Add function to close image modal
	const closeImageModal = () => {
		setIsImageModalOpen(false);
		setModalImage(null);
	};

	// Enhance the global click handler to be more aggressive in preventing default behavior
	useEffect(() => {
		const handleMessageContentClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			
			if (target.tagName === 'IMG' || 
				(target.tagName === 'A' && target.querySelector('img'))) {
				
				event.preventDefault();
				event.stopPropagation();
				
				let imgSrc = '';
				if (target.tagName === 'IMG') {
					imgSrc = (target as HTMLImageElement).src;
				} else {
					const img = target.querySelector('img');
					if (img) {
						imgSrc = img.src;
					}
				}
				
				if (imgSrc) {
					openImageModal(imgSrc);
					return false;
				}
			}
		};
		
		document.addEventListener('click', handleMessageContentClick, true);
		document.addEventListener('auxclick', handleMessageContentClick, true);
		
		return () => {
			document.removeEventListener('click', handleMessageContentClick, true);
			document.removeEventListener('auxclick', handleMessageContentClick, true);
		};
	}, [openImageModal]);

	// Add useEffect to handle cleanup when component unmounts
	useEffect(() => {
		return () => {
			// When component unmounts, leave the chat if there's a selected user
			if (selectedUser) {
				leaveChat(selectedUser.userId);
			}
		};
	}, [selectedUser]);

	return (
		<div className="h-full flex flex-col bg-white shadow-lg">
			<div className="h-full flex flex-col md:flex-row">
				{/* Users List */}
				<div
					className={`${
						selectedUser
							? "hidden md:block md:w-1/3 lg:w-1/4"
							: "w-full"
					} h-full border-r border-gray-200 bg-white flex flex-col`}
				>
					{/* Search header */}
					<div className="sticky top-0 p-4 border-b border-gray-200 bg-white z-10">
						{" "}
						{/* p-3 -> p-4 */}
						<div className="flex items-center gap-3">
							{" "}
							{/* gap-2 -> gap-3 */}
							<Button
								type="text"
								icon={
									<Icon
										icon="mdi:arrow-left"
										width="24"
										height="24"
									/>
								}
								className="flex-none text-gray-700"
								onClick={() => {
									if (selectedUser) {
										leaveChat(selectedUser.userId);
									}
									router.push("/");
								}}
							/>
							<AutoComplete
								value={searchInput}
								options={searchResults}
								onSearch={(value) => {
									setSearchInput(value);
									handleSearch(value);
								}}
								onSelect={handleSearchSelect}
								className="w-full"
								dropdownClassName="bg-white rounded-lg shadow-lg border border-gray-200"
								dropdownMatchSelectWidth={true}
								dropdownStyle={{
									padding: "8px",
									maxHeight: "400px",
								}}
								optionRender={(option) => (
									<div className="flex items-center p-2 hover:bg-gray-50 cursor-pointer w-full overflow-hidden">
										<Avatar
											size={40}
											className="bg-gray-700 flex-shrink-0"
											icon={
												<Icon
													icon="mdi:user"
													width="20"
													height="20"
												/>
											}
										/>
										<div className="ml-3 min-w-0 flex-1">
											<div className="font-medium text-sm text-gray-800 truncate">
												{option.label}
											</div>
											<div className="text-xs text-gray-500 truncate">
												Mesaj gönder
											</div>
										</div>
									</div>
								)}
							>
								<Input
									className="rounded-full border-gray-300"
									placeholder="Kişilerde ara..."
									prefix={
										<Icon
											icon="mdi:magnify"
											width="20"
											height="20"
											className="text-gray-400"
										/>
									}
								/>
							</AutoComplete>
						</div>
					</div>

					{/* Users list */}
					<div className="flex-1 overflow-y-auto">
						<List
							dataSource={messageUsers}
							renderItem={(user) => (
								<List.Item
									onClick={() => handleUserClick(user)}
									className={`cursor-pointer hover:bg-gray-50 transition-colors ${
										selectedUser?.userId === user.userId
											? "bg-gray-100"
											: ""
									}`}
								>
									<div className="flex items-center w-full px-4 py-3">
										<Badge
											count={user.unreadCount}
											size="small"
											offset={[-2, 2]}
											style={{ backgroundColor: "red" }}
										>
											<Avatar
												size={48}
												src={user.userImage}
												className="bg-gray-700 flex items-center justify-center"
												icon={
													!user.userImage && (
														<Icon
															icon="mdi:user"
															width="28"
															height="28"
														/>
													)
												}
											/>
										</Badge>
										<div className="ml-4 flex-grow min-w-0">
											<div className="flex justify-between items-center">
												<span className="font-medium truncate text-base text-gray-800">
													{user.fullName}
												</span>
												<span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
													{formatMessageDate(
														user.lastMessageDate
													)}
												</span>
											</div>
											<div className="flex items-center gap-1">
												{user.unreadCount > 0 && (
													<span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
												)}
												<p
													className={`text-sm truncate mt-0.5 ${
														user.unreadCount > 0
															? "font-medium text-gray-800"
															: "text-gray-500"
													}`}
												>
													{user.lastMessageOwner 
														? formatReadStatus(user) || user.lastMessage 
														: user.lastMessage}
												</p>
											</div>
										</div>
									</div>
								</List.Item>
							)}
							locale={{
								emptyText: (
									<span className="text-gray-500">
										Kişi bulunamadı
									</span>
								),
							}}
						/>
						<div className="mt-2 pb-4 text-center">
							{canLoadMoreUsers && (
								<button
									onClick={loadMoreUsers}
									disabled={loadingUsers}
									className="mx-auto px-4 py-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
								>
									{loadingUsers ? 'Yükleniyor...' : 'Daha fazla kullanıcı yükle'}
								</button>
							)}
							{!canLoadMoreUsers && messageUsers.length > 0 && (
								<div className="text-center py-2 text-gray-500 text-sm">
									Tüm kullanıcılar yüklendi
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Chat Area */}
				{selectedUser ? (
					<div className="flex-1 flex flex-col h-full">
						{/* Chat Header */}
						<div className="flex-none p-4 bg-white border-b border-gray-200 flex items-center justify-between z-10 shadow">
							<div className="flex items-center">
								<Button
									type="text"
									icon={
										<Icon
											icon="mdi:arrow-left"
											width="24"
											height="24"
										/>
									}
									className="mr-2 md:hidden"
									onClick={() => {
										if (selectedUser) {
											leaveChat(selectedUser.userId);
										}
										setSelectedUser(null);
										setSearchInput("");
										setSearchResults([]);
										getAllUsersMessageHandler(1);
									}}
								/>
								<Avatar
									size={40}
									src={selectedUser.userImage}
									className="bg-gray-700"
									icon={
										!selectedUser.userImage && (
											<Icon
												icon="mdi:user"
												width="24"
												height="24"
											/>
										)
									}
								/>
								<div className="ml-3">
									<div className="font-medium text-base text-gray-800">
										{selectedUser.fullName}
									</div>
									<div className="text-xs text-gray-500">
										Çevrimiçi
									</div>{" "}
									{/* "Online" -> "Çevrimiçi" */}
								</div>
							</div>
							<Button
								type="text"
								shape="circle"
								icon={
									<Icon
										icon="mdi:dots-vertical"
										width="24"
										height="24"
										className="text-gray-700"
									/>
								}
							/>
						</div>

						{/* Messages Area */}
						<div className="flex-1 overflow-y-auto bg-gray-50" ref={messagesContainerRef}>
							<div className="p-4 space-y-3 flex flex-col">
								{selectedUser && userMessages && userMessages[selectedUser.userId] && (
									<>
										{showLoadMore && canLoadMore && (
											<div className="text-center py-2">
												<button
													onClick={loadMoreMessages}
													disabled={messageLoading}
													className="mx-auto px-4 py-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
												>
													{messageLoading ? 'Yükleniyor...' : 'Daha fazla mesaj yükle'}
												</button>
											</div>
										)}
										{!canLoadMore && (
											<div className="text-center py-2 text-gray-500 text-sm">
												Tüm mesajlar yüklendi
											</div>
										)}
										{[...userMessages[selectedUser.userId]]
											.sort((a, b) => {
												const dateA = new Date(a.createdAt).getTime();
												const dateB = new Date(b.createdAt).getTime();
												if (dateA !== dateB) return dateA - dateB;
												
												return a.id.localeCompare(b.id);
											})
											.filter((message, index, self) => 
												index === self.findIndex(m => m.id === message.id)
											)
											.map((message) => (
												<div
													key={`msg-${message.id}`}
													className={`message-item max-w-[80%] md:max-w-[70%] ${
														message.isOwner ? "ml-auto" : "mr-auto"
													}`}
												>
													<div
														className={`p-3 break-words message-content ${
															message.isOwner
																? "bg-gray-800 text-white rounded-2xl rounded-br-sm"
																: "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-200 shadow"
														}`}
														style={{
															maxHeight: "400px",
															overflowY: "auto",
															wordBreak: "break-word",
														}}
														dangerouslySetInnerHTML={{ __html: message.content }}
													/>
													<div
														className={`text-xs text-gray-500 mt-1 ${
															message.isOwner
																? "text-right"
																: "text-left"
														} px-1`}
													>
														{formatMessageDate(
															message.createdAt
														)}
													</div>
												</div>
											))}
									</>
								)}
								<div ref={messagesEndRef} className="h-[1px]" />
							</div>
						</div>

						{/* Message Input */}
						<div className="flex-none border-t border-gray-200 bg-white">
							{/* Image preview area */}
							{imagePreview && (
								<div className="max-w-4xl mx-auto px-3 pt-3">
									<div className="relative inline-block">
										<img 
											src={imagePreview} 
											alt="Selected" 
											className="max-h-32 rounded-lg border border-gray-300" 
										/>
										<button 
											onClick={removeSelectedImage}
											className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-tr-lg rounded-bl-lg p-1.5 hover:bg-opacity-75 transition-colors"
										>
											<Icon icon="mdi:close" width="24" height="24" />
										</button>
									</div>
								</div>
							)}
							
							{/* Image error message */}
							{imageError && (
								<div className="max-w-4xl mx-auto px-3 pt-1">
									<div className="text-red-500 text-sm">{imageError}</div>
								</div>
							)}
							
							{/* Message input and buttons */}
							<div className="max-w-4xl mx-auto p-3 flex items-end gap-2">
								{/* Image upload button */}
								<Button
									type="text"
									shape="circle"
									className="hover:bg-gray-100 flex-none"
									icon={<Icon icon="mdi:image" width="24" height="24" className="text-gray-600" />}
									onClick={() => fileInputRef.current?.click()}
								/>
								<input
									type="file"
									ref={fileInputRef}
									className="hidden"
									accept="image/*"
									onChange={handleImageSelect}
								/>
								
								<Input.TextArea
									value={messageInput}
									onChange={(e) => setMessageInput(e.target.value)}
									placeholder="Mesajınızı yazın..."
									onPressEnter={(e) => {
										if (!e.shiftKey) {
											e.preventDefault();
											handleSendMessage();
										}
									}}
									className="rounded-2xl py-2 px-4 border-gray-300 hover:border-gray-400 focus:border-gray-500 focus:ring-0 min-h-[40px] max-h-[120px] resize-none"
									autoComplete="off"
									autoSize={{ minRows: 1, maxRows: 4 }}
								/>
								<Button
									type="primary"
									shape="round"
									className="flex items-center justify-center bg-gray-800 border-0 shadow flex-none"
									icon={<Icon icon="mdi:send" width="24" height="24" />}
									disabled={!messageInput && !selectedImage}
									onClick={handleSendMessage}
									size="large"
								/>
							</div>
						</div>
					</div>
				) : (
					<div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
						<div className="text-center max-w-xl p-12 space-y-6">
							<Icon
								icon="mdi:chat-outline"
								width="96"
								height="96"
								className="mx-auto text-gray-400"
							/>
							<h2 className="text-3xl font-medium text-gray-700">
								Mesajlara Hoş Geldiniz
							</h2>{" "}
							{/* "Welcome to Messages" -> "Mesajlara Hoş Geldiniz" */}
							<p className="text-lg text-gray-500">
								Mesajlaşmaya başlamak için bir kişi seçin
							</p>{" "}
							{/* "Select a contact to start messaging" -> "Mesajlaşmaya başlamak için bir kişi seçin" */}
							<p className="text-sm text-gray-400">
								Konuşmalarınız burada görüntülenir
							</p>{" "}
							{/* "Your conversations are displayed here" -> "Konuşmalarınız burada görüntülenir" */}
						</div>
					</div>
				)}
			</div>
			{selectedUser && showScrollToBottom && (
				<button
					onClick={() => {
						setNewMessageCount(0);
						scrollToBottom(true);
						
						setTimeout(() => {
							if (messagesContainerRef.current) {
								const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
								const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
								if (distanceFromBottom < 20) {
									setShowScrollToBottom(false);
								}
							}
						}, 500);
					}}
					className="fixed bottom-20 right-4 bg-gray-800 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-700 transition-colors z-50"
				>
					{newMessageCount > 0 && (
						<span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
							{newMessageCount}
						</span>
					)}
					<Icon icon="mdi:arrow-down" width="20" height="20" />
				</button>
			)}
			{isImageModalOpen && modalImage && (
				<div 
					className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					style={{
						animation: 'fadeIn 0.2s ease-out',
					}}
				>
					<div 
						className="relative max-w-full max-h-full overflow-hidden rounded-lg shadow-2xl"
						style={{
							animation: 'scaleIn 0.3s ease-out',
							transformOrigin: 'center',
						}}
					>
						<button 
							className="absolute top-0 right-0 bg-black/60 text-white rounded-bl-lg p-1.5 hover:bg-black/80 transition-colors z-20"
							onClick={closeImageModal}
						>
							<Icon icon="mdi:close" width="24" height="24" />
						</button>
						
						<div className="bg-gray-800 p-0.5">
							<img 
								src={modalImage} 
								alt="Büyütülmüş görsel" 
								className="max-w-full max-h-[85vh] object-contain"
								style={{
									boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
								}}
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
					</div>
					
					<div 
						className="absolute inset-0 cursor-pointer" 
						onClick={closeImageModal}
					></div>
					
					<style jsx global>{`
						@keyframes fadeIn {
							from { opacity: 0; }
							to { opacity: 1; }
						}
						@keyframes scaleIn {
							from { transform: scale(0.9); opacity: 0; }
							to { transform: scale(1); opacity: 1; }
						}
					`}</style>
				</div>
			)}
		</div>
	);
};

export default Messages;
