'use client';

import { useStore } from '@/store';
import { ERRORS } from '@/store/slices/errorSlice';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Input, Avatar, Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SearchDetailPage = () => {
    const { searchUsers, getSearchUsers,createFollowRequest ,followErrors,setErrorConfirmInfoModal} = useStore();
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const handleSearch = async (value: string) => {
        if (value.length > 0) {
            await getSearchUsers(value, 1);
        }
    };

    const handleInputChange = (value: string) => {
        // Eğer bir önceki timeout varsa temizle
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            handleSearch(value);
        }, 500); // 1 saniye bekleme süresi

        setDebounceTimeout(timeout);
    };

    useEffect(() => {
        if (followErrors) {
            setErrorConfirmInfoModal(
                ERRORS.GENERIC_INFO_AND_ERRORS,
                "Hata",
                followErrors,
                "error"
            );
        }
    }, [followErrors]);

    return (
		<div className="max-w-2xl mx-auto p-4">
			<div className="mb-6">
				<Input
					size="large"
					placeholder="Kullanıcı ara..."
					allowClear
					className="w-full"
					prefix={
						<Icon
							icon="mingcute:search-3-line"
							width="24"
							height="24"
						/>
					}
					onChange={(e) => handleInputChange(e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				{searchUsers.map((user) => (
					<div
						key={user.id}
						className="flex items-center justify-between p-2 hover:bg-gray-200 bg-gray-50 rounded-lg transition-colors cursor-pointer"
					>
						<Link href={`/users/${user.id}`} className="flex items-center">
                            <div className="flex items-center">
                                <Avatar
                                    size={36}
                                    className="mr-3"
                                    src={user.profileImage || undefined}
                                >
                                    {!user.profileImage && user.fullName[0]}
                                </Avatar>
                                <div>
                                    <h3 className="text-base font-medium">
                                        {user.fullName}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        @{user.username}
                                    </p>
                                </div>
                            </div>
                        </Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default SearchDetailPage;