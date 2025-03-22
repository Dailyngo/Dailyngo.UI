"use client";
import React, { useState } from "react";
import moment from 'moment';
import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, Button, DatePicker, Input, Select, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { on } from "events";
import TextArea from "antd/lib/input/TextArea";

// Global CSS
const globalStyles = `
  body, html {
    background-color: white;
  }
`;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Gönderiler");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCommunication, setIsOpenCommunication] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const genderOptions = [
		{ value: 0, label: "Belirtilmemiş" },
		{ value: 1, label: "Erkek" },
		{ value: 2, label: "Kadın" },
  ];

  const defaultValue = moment();

  const handleEdit = () => {
		setOnEdit(!onEdit);
}

  return (
		<>
			<style>{globalStyles}</style>
			<div className="h-screen bg-white">
				<div className="w-full bg-white shadow-md p-6 flex items-center justify-between border-2 border-purple-200">
					<div className="flex items-center gap-4">
						<div className="text-2xl font-bold text-gray-700">
							LOGO
						</div>
						<div className="flex items-center bg-gray-200 px-3 py-2 rounded-full">
							<Icon
								icon="ant-design:menu-outlined"
								width="24"
								height="24"
								className="text-gray-500"
							/>
							<input
								type="text"
								placeholder="Hinted search text"
								className="bg-transparent outline-none ml-2 text-sm"
							/>
							<Icon
								icon="line-md:search"
								width="24"
								height="24"
								className="text-gray-500"
							/>
						</div>
					</div>

					<div className="flex items-center gap-4 text-purple-500">
						<Icon
							icon="ant-design:message-outlined"
							width="24"
							height="24"
							className="cursor-pointer hover:text-purple-700"
						/>
						<Icon
							icon="ant-design:bell-outlined"
							width="24"
							height="24"
							className="cursor-pointer hover:text-purple-700"
						/>
						<Icon
							icon="ant-design:user-outlined"
							width="24"
							height="24"
							className="cursor-pointer hover:text-purple-700"
						/>
					</div>
				</div>
				<div className="flex-1 max-w-4xl mx-auto bg-white p-6 mt-6">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-4">
							<Avatar
								size={80}
								icon={<Icon icon="ant-design:user-outlined" />}
								className="bg-purple-400"
							/>
							<div>
								<h2 className="text-xl font-semibold">
									Burakhan Kurt
								</h2>
								<p className="text-gray-500">100 takip</p>
								<p className="text-gray-500">100 takipçi</p>
							</div>
						</div>
					</div>

					<Tabs
						activeKey={activeTab}
						onChange={(key) => {
							setActiveTab(key);
						}}
						className="w-full p-6 flex items-center justify-between"
					>
						<TabPane
							tab="Gönderiler"
							key="posts"
							className={`min-w-xs pb-2`}
						></TabPane>
						<TabPane
							tab="Hakkında"
							key="about"
							className={`min-w-xs pb-2`}
						>
							<div className="pb-4">
								<div
									className="grid grid-cols-12 bg-gray-50 p-2 cursor-pointer rounded-lg gap-2"
									onClick={() => setIsOpen(!isOpen)}
								>
									<div className="col-span-12 md:col-span-3 lg:col-span-2 flex items-center gap-2 w-full">
										{isOpen ? (
											<Icon
												icon="ant-design:caret-up-outlined"
												width="24"
												height="24"
												className="text-gray-500 shrink-0"
											/>
										) : (
											<Icon
												icon="ant-design:caret-down-outlined"
												width="24"
												height="24"
												className="text-gray-500 shrink-0"
											/>
										)}
										<span className="font-bold text-gray-600 truncate min-w-100">
											Biyografi
										</span>
									</div>
								</div>

								{isOpen && (
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="col-span-3 bg-white p-3 rounded-lg w-full mx-auto flex flex-col space-y-4">
											<div className="flex items-center justify-end">
												{!onEdit && (
													<div className="flex items-center pr-2">
														<Button
															type="primary"
															className=" hover:bg-purple-200 border-none text-white rounded-md"
															onClick={() => setOnEdit(!onEdit)}
														>
															Kaydet
														</Button>
													</div>
												)}
												<Button
													type="primary"
													className="bg-purple-600 hover:bg-purple-200 border-none text-white rounded-md"
													onClick={handleEdit}
												>
													{onEdit ? (
														<Icon
															icon="material-symbols:edit-outline"
															width="24"
															height="24"
														/>
													) : (
														<Icon
															icon="material-symbols:edit-off-outline"
															width="24"
															height="24"
														/>
													)}
												</Button>
											</div>
											<TextArea
												className="w-full p-2 rounded-lg"
												rows={6}
												placeholder="Biyografinizi buraya yazın..."
												disabled={onEdit}
											/>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
												<Input
													placeholder="Ad Soyad"
													className="w-full rounded-lg min-h-10 p-2"
													value={"Burakhan Kurt"}
													disabled={onEdit}
												/>
												<Select
													placeholder="Cinsiyet"
													className="w-full rounded-lg min-h-10"
													options={genderOptions}
													value={
														genderOptions[1].label
													}
													disabled={onEdit}
												/>
												<DatePicker
													placeholder="Doğum Tarihi"
													className="w-full rounded-lg min-h-10 p-2"
													format="DD/MM/YYYY"
													disabled={onEdit}
												/>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
												<div className="text-center">
													<h4 className="text-gray-600 text-sm font-semibold">
														Üniversite
													</h4>
													<Select
														placeholder="Üniversite"
														className="w-full rounded-lg min-h-10"
														options={genderOptions}
														value={
															genderOptions[1]
																.label
														}
														disabled={onEdit}
													/>
												</div>
												<div className="text-center">
													<h4 className="text-gray-600 text-sm font-semibold">
														Fakülte
													</h4>
													<Select
														placeholder="Fakülte"
														className="w-full rounded-lg min-h-10"
														options={genderOptions}
														value={
															genderOptions[1]
																.label
														}
														disabled={onEdit}
													/>
												</div>
												<div className="text-center">
													<h4 className="text-gray-600 text-sm font-semibold">
														Bölümü
													</h4>
													<Select
														placeholder="Bölüm"
														className="w-full rounded-lg min-h-10"
														options={genderOptions}
														value={
															genderOptions[1]
																.label
														}
														disabled={onEdit}
													/>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>

							<div className="border-b border-gray-300">
								<div
									className="grid grid-cols-12 bg-gray-50 p-2 cursor-pointer rounded-lg gap-2"
									onClick={() =>
										setIsOpenCommunication(
											!isOpenCommunication
										)
									}
								>
									<div className="col-span-12 md:col-span-3 lg:col-span-2 flex items-center gap-2 w-full">
										{isOpenCommunication ? (
											<Icon
												icon="ant-design:caret-up-outlined"
												className="w-6 h-6 text-gray-500 shrink-0"
											/>
										) : (
											<Icon
												icon="ant-design:caret-down-outlined"
												className="w-6 h-6 text-gray-500 shrink-0"
											/>
										)}
										<span className="font-bold text-gray-600 truncate min-w-100">
											İletişim Bilgileri
										</span>
									</div>
								</div>

								{isOpenCommunication && (
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="col-span-3 bg-white p-3 rounded-lg w-full mx-auto flex flex-col space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
												<div className="text-center">
													<h4 className="text-gray-600 text-sm font-semibold">
														Telefon
													</h4>
													<Input
														className="w-full p-2 rounded-lg"
														placeholder="Telefon Numarası"
														disabled={onEdit}
													/>
												</div>
												<div className="text-center">
													<h4 className="text-gray-600 text-sm font-semibold">
														E-posta
													</h4>
													<Input
														className="w-full p-2 rounded-lg"
														placeholder="E-posta"
														disabled={onEdit}
													/>
												</div>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:mt-0">
												<div className="text-center">
													<h4 className="text-gray-600 text-sm font-semibold">
														Adres
													</h4>
													<Select
														placeholder="Şehir"
														className="w-full rounded-lg min-h-10"
														options={genderOptions}
														value={
															genderOptions[1]
																.label
														}
														disabled={onEdit}
													/>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</TabPane>
						<TabPane
							tab="Arkadaşlar"
							key="friends"
							className={`min-w-xs pb-2`}
						/>
						<TabPane
							tab="Rozetler"
							key="badges"
							className={`min-w-xs pb-2`}
						/>
					</Tabs>
				</div>
			</div>
		</>
  );
}