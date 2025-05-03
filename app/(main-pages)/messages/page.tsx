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

	// Today
	if (days === 0) {
		return date.toLocaleTimeString("tr-TR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	}
	// Yesterday
	else if (days === 1) {
		return (
			"Dün " +
			date.toLocaleTimeString("tr-TR", {
				hour: "2-digit",
				minute: "2-digit",
			})
		);
	}
	// Within last week
	else if (days < 7) {
		return date.toLocaleDateString("tr-TR", {
			weekday: "long",
			hour: "2-digit",
			minute: "2-digit",
		});
	}
	// Older messages
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
	const [scrollPosition, setScrollPosition] = useState<number>(0);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const loaderRef = useRef(null);

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
		if (receiveMessage) {
			const userId = receiveMessage.senderId;
			const newMessage: Message = {
				id: receiveMessage.messageId,
				content: receiveMessage.message,
				createdAt: receiveMessage.sendDate,
				isOwner: false,
			};
			setNewUserMessages(userId, newMessage);
			setTimeout(() => {
				if (selectedUser?.userId === userId) {
					scrollToBottom();
				}
			}, 100);
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

	const getAllUsersMessageHandler = async () => {
		await getAllUsersMessage(1);
	};

	const getAllMessagesHandler = async (
		userId: string,
		pageNumber?: number | null
	) => {
		await getAllMessages(userId, pageNumber ?? 1);
	};

	const handleUserClick = async (user: MessageUser) => {
		setCurrentPage(1);
		setCanLoadMore(true);
		await getAllMessagesHandler(user.userId, 1);
		setSelectedUser(user);
	};

	const handleSendMessage = async () => {
		if (messageInput.trim() === "" || !selectedUser) return;

		await signalRConnection.invoke(
			"SendMessage",
			selectedUser.userId,
			messageInput
		);
		await getAllMessagesHandler(selectedUser.userId, 1);
		setMessageInput("");
		setCurrentPage(1);
		setCanLoadMore(true);
		setTimeout(() => scrollToBottom(), 100);
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
		};

		setSelectedUser(selectedSearchUser);
		setSearchInput("");
		setSearchResults([]);
	};

	useEffect(() => {
		const fetchData = async () => {
			if (!selectedUser) return;

			if (currentPage === 1) {
				await getAllMessagesHandler(selectedUser?.userId, 1);
				return;
			}
			await getAllMessagesHandler(selectedUser?.userId, currentPage);
			if (userMessages[selectedUser?.userId].length%40 !== 0) {	
				setCanLoadMore(false);
			}
		};

		fetchData();
	}, [getAllMessages, currentPage, selectedUser]);

	useEffect(() => {
		console.log("Fetching messages for the selected user...", userMessages);
	}, [userMessages]);

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [target] = entries;
			console.log(
				"Intersection Observer triggered",
				target.isIntersecting,
				messageLoading,
				canLoadMore
			);

			if (
				target.isIntersecting &&
				!messageLoading &&
				canLoadMore &&
				selectedUser
			) {
				setCurrentPage((prev) => prev + 1);
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
								onClick={() => router.push("/")}
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
													{user.lastMessage}
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
							}} // "No contacts found" -> "Kişi bulunamadı"
						/>
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
										setSelectedUser(null);
										setSearchInput("");
										setSearchResults([]);
										getAllUsersMessageHandler();
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
						<div className="flex-1 overflow-y-auto bg-gray-50">
							<div className="p-4 space-y-3 flex flex-col">
								{selectedUser && userMessages && userMessages[selectedUser.userId] && (
									<>
										<div ref={loaderRef} className="text-center py-2">
											{messageLoading && (
												<div className="flex justify-center items-center">
													<Icon icon="line-md:loading-loop" width="32" height="32" />
												</div>
											)}
										</div>
										{[...userMessages[selectedUser.userId]]
											.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
											.map((message) => (
												<div
													key={message.id}
													className={`max-w-[80%] md:max-w-[70%] ${
														message.isOwner
															? "ml-auto"
															: "mr-auto"
													}`}
												>
													<div
														className={`p-3 break-words whitespace-pre-wrap ${
															message.isOwner
																? "bg-gray-800 text-white rounded-2xl rounded-br-sm"
																: "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-200 shadow"
														}`}
														style={{
															maxHeight: "400px", // Maksimum yükseklik
															overflowY: "auto", // Dikey scroll
															wordBreak: "break-word", // Uzun kelimeleri kır
														}}
													>
														{message.content}
													</div>
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
							<div className="max-w-4xl mx-auto p-3 flex items-end gap-2">
								{" "}
								{/* items-center -> items-end */}
								<Button
									type="text"
									shape="circle"
									className="hover:bg-gray-100 flex-none" // flex-none eklendi
									icon={
										<Icon
											icon="mdi:emoticon-outline"
											width="24"
											height="24"
											className="text-gray-600"
										/>
									}
								/>
								<Button
									type="text"
									shape="circle"
									className="hover:bg-gray-100 flex-none" // flex-none eklendi
									icon={
										<Icon
											icon="mdi:paperclip"
											width="24"
											height="24"
											className="text-gray-600"
										/>
									}
								/>
								<Input.TextArea // Input -> Input.TextArea
									value={messageInput}
									onChange={(e) =>
										setMessageInput(e.target.value)
									}
									placeholder="Mesajınızı yazın..."
									onPressEnter={(e) => {
										// onPressEnter güncellendi
										if (!e.shiftKey) {
											e.preventDefault();
											handleSendMessage();
										}
									}}
									className="rounded-2xl py-2 px-4 border-gray-300 hover:border-gray-400 focus:border-gray-500 focus:ring-0 min-h-[40px] max-h-[120px] resize-none"
									autoComplete="off"
									autoSize={{ minRows: 1, maxRows: 4 }} // Otomatik yükseklik ayarı
								/>
								<Button
									type="primary"
									shape="round"
									className="flex items-center justify-center bg-gray-800 border-0 shadow flex-none" // flex-none eklendi
									icon={
										<Icon
											icon="mdi:send"
											width="24"
											height="24"
										/>
									}
									disabled={!messageInput}
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
		</div>
	);
};

export default Messages;
