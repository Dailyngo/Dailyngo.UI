'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { Input, Avatar } from 'antd';
import { useState } from 'react';

const mockUsers = [
    {
        "id": "af2c2db3-7572-4c2b-bd83-6a0ac7fad50f",
        "username": "admin",
        "fullName": "Dailyngo Admin"
    },
    {
        "id": "e995cee3-8ec8-4303-8efa-a917d80174b3",
        "username": "ibrahimhates",
        "fullName": "Ibrahim Halil Ateş"
    },
    {
        "id": "cb13d365-f7cb-4f27-88b9-220d3eb36052",
        "username": "burakhan",
        "fullName": "sdfsd sdfs"
    }
];

const SearchDetailPage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(mockUsers);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        if (value) {
            const filtered = mockUsers.filter(user => 
                user.fullName.toLowerCase().includes(value.toLowerCase()) ||
                user.username.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(mockUsers);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6">
                <Input
                    size="large"
                    placeholder="Kullanıcı ara..."
                    allowClear
                    className="w-full"
                    prefix={<Icon icon="mingcute:search-3-line" width="24" height="24" />}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                {filteredUsers.map(user => (
                    <div 
                        key={user.id} 
                        className="flex items-center p-2 hover:bg-gray-200 bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                        <Avatar size={36} className="mr-3">{user.fullName[0]}</Avatar>
                        <div>
                            <h3 className="text-base font-medium">{user.fullName}</h3>
                            <p className="text-gray-500 text-sm">@{user.username}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchDetailPage;