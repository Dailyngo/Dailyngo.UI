import { Icon } from "@iconify/react/dist/iconify.js";
import { Menu, Dropdown, Button, Badge, Space } from "antd"; // Badge bileşenini ekleyin
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStore } from '../../store';
import {
	Home,
	HomeFill,
	Search,
	SearchFill,
	Notification,
	NotificationFill,
	Message,
	MessageFill,
} from "@/components/svgicon";

type Params= {
	notificationCount: number;
}

const CustomNavbar = ({notificationCount}:Params) => {
	const pathname = usePathname();
	const { logout } = useStore();
	const menuItems = [
		{
			key: "/",
			icon: (
				<Link href="/" className="flex items-center">
					<Space size="middle">
						{pathname === "/" ? <HomeFill /> : <Home />}
					</Space>
				</Link>
			),
		},
		{
			key: "/search",
			icon: (
				<Link href="/search" className="flex items-center">
					<Space size="middle">
						{pathname === "/search" ? <SearchFill /> : <Search />}
					</Space>
				</Link>
			),
		},
		{
			key: "/notifications",
			icon: (
				<Link href="/notifications" className="flex items-center">
					<Space size="middle">
						<Badge count={notificationCount}>
							{pathname === "/notifications" ? <NotificationFill /> : <Notification />}
						</Badge>
					</Space>
				</Link>
			),
		},
		{
			key: "/messages",
			icon: (
				<Link href="/messages" className="flex items-center">
					<Space size="middle">
						{pathname === "/messages" ? <MessageFill /> : <Message />}
					</Space>
				</Link>
			),
		},
	];

	const handleLogout = async () => {
		logout();
	};

	const items = [
		{
			key: '1',
			label: 'Çıkış Yap',
			onClick: handleLogout
		}
	];

	return (
		<div className="w-full bg-white shadow-md px-4 md:px-6 py-3 flex items-center justify-between border-b border-gray-200">
			{/* Logo - Left Side */}
			<div className="flex-shrink-0">
				<Link href="/">
					<Image
						src="/images/logo.png"
						alt="Logo"
						width={40}
						height={40}
						className="object-contain"
					/>
				</Link>
			</div>

			{/* Navigation - Center */}
			<div className="hidden sm:block flex-grow max-w-2xl mx-auto">
				<Menu
					mode="horizontal"
					selectedKeys={[pathname]}
					items={menuItems}
					className="flex justify-center border-none [&_.ant-menu-item-selected::after]:bg-transparent [&_.ant-menu-item::after]:bg-transparent [&_.ant-menu-item]:!text-gray-600 [&_.ant-menu-item-selected]:!text-black"
				/>
			</div>
			{/* Profile - Right Side */}
			<div className="flex-shrink-0">
				<Dropdown
					menu={{ items }}
					placement="bottomRight"
					trigger={['click']}
				>
					<Button type="text" className="p-0">
						<Icon
							icon="ant-design:user-outlined"
							width="36"
							height="36"
							className="cursor-pointer text-gray-600 hover:text-gray-900"
						/>
					</Button>
				</Dropdown>
			</div>
		</div>
	);
};

export default CustomNavbar;