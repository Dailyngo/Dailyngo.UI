"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Tag, Button, Modal, Badge } from "antd";
import { Icon } from "@iconify/react";
import { useStore } from "@/store";
import PostCard from "@/components/homepage/postCard";
import { PostData } from "@/store/slices/postSlice";
import { ReportData, ReportPostData } from "@/store/slices/reportSlice";

const ReportsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const { reports, getReports, getPostDetailService, reportLoading, deletePostWithReport,setReportStatus } = useStore();
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

    const [currentDateTime, setCurrentDateTime] = useState('');	

    const loadAllReports = async () => {
        setLoading(true);
        await getReports();
        setLoading(false);
    };

    useEffect(() => {
        loadAllReports();
        setCurrentDateTime(new Date().toLocaleString());
    }, []);

    const handleViewPost = async (postId: string) => {
        const post = await getPostDetailService(postId);
        setSelectedPost(post);
        setIsViewModalVisible(true);
    };

    const handlePostDelete = async (postId: string) => {
        await deletePostWithReport(postId);
        setIsViewModalVisible(false);
    };

    const handleProcessReport = async (postId: string) => {
        await setReportStatus(postId);
        await loadAllReports();
    };

    const columns = [
        {
            title: "Post ID",
            dataIndex: "id",
            key: "id",
            render: (id: string, record: ReportPostData) => (
                <div className="flex items-center">
                    <span>{id}</span>
                    {!record.isDeleted && (
                        <Badge 
                            status="success" 
                            text="Aktif" 
                            className="ml-2" 
                            style={{ fontSize: '11px' }} 
                        />
                    )}
                </div>
            ),
        },
        {
            title: "Rapor Sayısı",
            key: "reportCount",
            render: (_: any, record: ReportPostData) => (
                <Tag color="blue">{record.reportDetails.length}</Tag>
            ),
        },
        {
            title: "Son Rapor Tarihi",
            dataIndex: "lastReportDate",
            key: "lastReportDate",
            render: (date: string | null) =>
                date
                    ? new Date(date).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                      })
                    : "Bilinmiyor",
        },
        {
            title: "Durum",
            key: "status",
            render: (_: any, record: ReportPostData) => {
                const isProcess = record.reportDetails.some((r) => r.isProcess);
                const color = isProcess ? "processing" : "warning";
                const text = isProcess ? "İşlem Yapıldı" : "İnceleme Bekliyor";

                return record.isDeleted ? (
                    <Tag color="error">Silindi</Tag>
                ) : (
                    <Tag color={color}>{text}</Tag>
                );
            },
        },
        {
            title: "İşlem",
            key: "action",
            render: (_: any, record: ReportPostData) => (
                <div className="flex space-x-2">
                    {!record.isDeleted ? (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => handleViewPost(record.id)}
                                icon={<Icon icon="majesticons:eye-line" width="16" height="16" />}
                            >
                                Görüntüle
                            </Button>
                            {record.reportDetails.some((r) => !r.isProcess) && (
                                <Button
                                    type="dashed"
                                    size="small"
                                    loading={reportLoading}
                                    onClick={() => handleProcessReport(record.id)}
                                    icon={<Icon icon="ph:check-circle" width="16" height="16" />}
                                >
                                    İşlem Yap
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button
                            type="default"
                            size="small"
                            icon={<Icon icon="carbon:view-filled" width="16" height="16" />}
                            onClick={() => window.open(`/posts/${record.id}`, "_blank")}
                            disabled
                        >
                            Silinmiş
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    // Genişletilmiş satır (alt tablo) için sütunlar - ReportData'ya göre düzenlenmiş
    const expandedRowRender = (record: ReportPostData) => {
        const innerColumns = [
            {
                title: "Rapor ID",
                dataIndex: "id",
                key: "id",
                render: (id: string) => id.substring(0, 8) + "...",
            },
            {
                title: "Sebep",
                dataIndex: "reason",
                key: "reason",
                render: (reason: string | null) => reason || "Sebep belirtilmemiş",
            },
            {
                title: "Raporlayan",
                key: "reportedBy",
                render: (_: any, record: ReportData) => (
                    <span>{record.reportedBy?.name || "Bilinmiyor"}</span>
                ),
            },
            {
                title: "Tarih",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (date: string) =>
                    new Date(date).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
            },
            {
                title: "Durum",
                key: "status",
                render: (_: any, record: ReportData) => {
                    const isProcess = record.isProcess;
                    const color = isProcess ? "success" : "warning";
                    const text = isProcess ? "İşlendi" : "İnceleme Bekliyor";

                    return <Tag color={color}>{text}</Tag>;
                },
            }
        ];

        return (
            <div className="bg-red-200 p-4 shadow-sm">
				<Table 
                columns={innerColumns} 
                dataSource={record.reportDetails} 
                pagination={false} 
                rowKey="id" 
                size="small" 
            />
			</div>
        );
    };

    return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-800">
						Raporlar
					</h1>
				</div>
				<div className="bg-gray-100 px-4 py-2 rounded-full text-gray-500 text-sm flex items-center">
					<Icon icon="uil:refresh" width="18" className="mr-2" />
					Son Güncelleme: {currentDateTime}
				</div>
			</div>

			{/* Raporlar Tablosu */}
			<Row gutter={[16, 16]}>
				<Col xs={24}>
					<Card
						title={
							<div className="flex items-center justify-between">
								<span>Raporlanan Gönderiler</span>
								<div className="flex items-center space-x-4">
									<div className="flex items-center">
										<Badge status="success" />
										<span className="text-xs ml-1">
											Aktif Gönderiler
										</span>
									</div>
									<div className="flex items-center">
										<Badge status="error" />
										<span className="text-xs ml-1">
											Silinmiş Gönderiler
										</span>
									</div>
								</div>
							</div>
						}
						bordered={false}
						loading={loading}
					>
						<Table
							columns={columns}
							dataSource={reports}
							rowKey="id"
							expandable={{
								expandedRowRender,
								expandRowByClick: true,
							}}
							rowClassName={(record: ReportPostData) =>
								record.isDeleted ? "bg-gray-50" : ""
							}
							pagination={false}
							size="small"
						/>
					</Card>
				</Col>
			</Row>

			{/* Gönderi Görüntüleme Modalı */}
			<Modal
				title="Gönderi Detayı"
				open={isViewModalVisible}
				onCancel={() => setIsViewModalVisible(false)}
				footer={[
					<Button
						key="openExternal"
						type="primary"
						onClick={() =>
							window.open(`/posts/${selectedPost?.id}`, "_blank")
						}
					>
						Yeni Sekmede Aç
					</Button>,
					<Button
						key="delete"
						danger
						loading={reportLoading}
						onClick={() =>
							selectedPost?.id &&
							handlePostDelete(selectedPost.id)
						}
					>
						Gönderiyi Sil
					</Button>,
				]}
				width={800}
			>
				<div className="min-h-[400px] p-4 border border-gray-200 rounded-md">
					{selectedPost ? (
						<PostCard post={selectedPost} onlyView={true} />
					) : (
						<span>Gönderi yükleniyor...</span>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default ReportsPage;