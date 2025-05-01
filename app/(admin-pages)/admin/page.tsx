"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "antd";
import { Icon } from "@iconify/react";
import { useStore } from "@/store";

const AdminDashboard = () => {
  const { statsLoading, getStatistics, stats } = useStore();

  const getStatisticsHandler = async () => {
    await getStatistics();
  }
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    getStatisticsHandler();
    setCurrentDateTime(new Date().toLocaleString());
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Genel İstatistikler</h1>
          <p className="text-gray-500 mt-1">Platform kullanım özeti</p>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-full text-gray-500 text-sm flex items-center">
          <Icon icon="uil:refresh" width="18" className="mr-2" />
          Son Güncelleme: {currentDateTime}
        </div>
      </div>

      <Row gutter={[20, 20]} className="mb-6">
        {/* Toplam Kullanıcı Sayısı */}
        <Col xs={24} sm={8}>
          <Card 
            bordered={false} 
            loading={statsLoading} 
            className="rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-blue-500 h-[150px]"
            bodyStyle={{ padding: '24px', height: '100%' }}
          >
            <div className="flex justify-between items-start h-full">
              <div className="flex flex-col justify-center">
                <p className="text-gray-500 mb-1 text-sm font-medium">Toplam Kullanıcı</p>
                <h2 className="text-3xl font-bold text-gray-800 m-0">
                  {stats.totalUserCount?.toLocaleString('tr-TR') || 0}
                </h2>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon icon="ph:users-three" className="text-blue-600" width={30} height={30} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Toplam Post Sayısı */}
        <Col xs={24} sm={8}>
          <Card 
            bordered={false} 
            loading={statsLoading} 
            className="rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-green-500 h-[150px]"
            bodyStyle={{ padding: '24px', height: '100%' }}
          >
            <div className="flex justify-between items-start h-full">
              <div className="flex flex-col justify-center">
                <p className="text-gray-500 mb-1 text-sm font-medium">Toplam Paylaşım</p>
                <h2 className="text-3xl font-bold text-gray-800 m-0">
                  {stats.totalPostCount?.toLocaleString('tr-TR') || 0}
                </h2>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon icon="majesticons:image" className="text-green-600" width={30} height={30} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Online Kullanıcı Sayısı */}
        <Col xs={24} sm={8}>
          <Card 
            bordered={false} 
            loading={statsLoading} 
            className="rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-purple-500 h-[150px]"
            bodyStyle={{ padding: '24px', height: '100%' }}
          >
            <div className="flex justify-between items-start h-full">
              <div className="flex flex-col justify-center">
                <p className="text-gray-500 mb-1 text-sm font-medium">Çevrimiçi Kullanıcılar</p>
                <div className="flex items-baseline">
                  <h2 className="text-3xl font-bold text-gray-800 m-0">
                    {stats.onlineUserCount?.toLocaleString('tr-TR') || 0}
                  </h2>
                  <div className="flex items-center ml-3">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-1"></span>
                    <span className="text-sm text-gray-500">
                      aktif
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon icon="ph:user-circle" className="text-purple-600" width={30} height={30} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;