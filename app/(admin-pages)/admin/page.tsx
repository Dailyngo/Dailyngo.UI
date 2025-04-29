"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Table, Tag, Button } from "antd";
import { Icon } from "@iconify/react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  // Mock veriler
  const mockStats = {
    totalUsers: 12487,
    activeUsers: 4328,
    newUsersToday: 157,
    totalPosts: 84532,
    reportedPosts: 342,
    reportedUsers: 78,
    blockedUsers: 24,
  };

  const recentReports = [
    {
      id: 1,
      type: "post",
      reason: "Uygunsuz İçerik",
      reportedBy: "user123",
      date: "2025-04-28",
      status: "pending",
    },
    {
      id: 2,
      type: "user",
      reason: "Taciz",
      reportedBy: "user456",
      date: "2025-04-28",
      status: "reviewed",
    },
    {
      id: 3,
      type: "post",
      reason: "Spam",
      reportedBy: "user789",
      date: "2025-04-27",
      status: "resolved",
    },
    {
      id: 4,
      type: "comment",
      reason: "Nefret Söylemi",
      reportedBy: "user101",
      date: "2025-04-27",
      status: "pending",
    },
    {
      id: 5,
      type: "user",
      reason: "Sahte Hesap",
      reportedBy: "user202",
      date: "2025-04-26",
      status: "reviewed",
    },
  ];

  // Sayfa yüklendiğinde loading durumunu güncelle
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Tablo sütunları
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tür",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const icons = {
          post: <Icon icon="mdi:post" className="mr-1" />,
          user: <Icon icon="mdi:user" className="mr-1" />,
          comment: <Icon icon="mdi:comment" className="mr-1" />,
        };
        return (
          <span className="flex items-center">
            {icons[type as keyof typeof icons]}
            {type === "post" ? "Gönderi" : type === "user" ? "Kullanıcı" : "Yorum"}
          </span>
        );
      },
    },
    {
      title: "Sebep",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Raporlayan",
      dataIndex: "reportedBy",
      key: "reportedBy",
    },
    {
      title: "Tarih",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        let text = "Bilinmiyor";
        
        if (status === "pending") {
          color = "warning";
          text = "İnceleme Bekliyor";
        } else if (status === "reviewed") {
          color = "processing";
          text = "İncelendi";
        } else if (status === "resolved") {
          color = "success";
          text = "Çözüldü";
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "İşlem",
      key: "action",
      render: (_: any, record: any) => (
        <Button type="link" size="small">
          Detay
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <span className="text-gray-500">
          Son Güncelleme: {new Date().toLocaleString()}
        </span>
      </div>

      {/* İstatistik Kartları */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} loading={loading} className="h-full">
            <Statistic
              title="Toplam Kullanıcı"
              value={mockStats.totalUsers}
              prefix={<Icon icon="mdi:users-group" className="mr-2" />}
              valueStyle={{ color: "#3f8600" }}
            />
            <div className="mt-2 text-xs text-gray-500">
              Bugün: +{mockStats.newUsersToday}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} loading={loading} className="h-full">
            <Statistic
              title="Aktif Kullanıcı"
              value={mockStats.activeUsers}
              prefix={<Icon icon="mdi:user-check" className="mr-2" />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div className="mt-2 text-xs text-gray-500">
              Toplam Kullanıcıların {((mockStats.activeUsers / mockStats.totalUsers) * 100).toFixed(1)}%'i
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} loading={loading} className="h-full">
            <Statistic
              title="Raporlanan Gönderiler"
              value={mockStats.reportedPosts}
              prefix={<Icon icon="mdi:flag" className="mr-2" />}
              valueStyle={{ color: "#faad14" }}
            />
            <div className="mt-2 text-xs text-gray-500">
              İncelenmesi gerekiyor
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} loading={loading} className="h-full">
            <Statistic
              title="Engellenmiş Kullanıcılar"
              value={mockStats.blockedUsers}
              prefix={<Icon icon="mdi:block-user" className="mr-2" />}
              valueStyle={{ color: "#cf1322" }}
            />
            <div className="mt-2 text-xs text-gray-500">
              Kara Listeye alınmış
            </div>
          </Card>
        </Col>
      </Row>

      {/* Son Raporlar */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title="Son Raporlar"
            bordered={false}
            loading={loading}
            extra={
              <Button type="primary" href="/admin/reports">
                Tüm Raporlar
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={recentReports}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;