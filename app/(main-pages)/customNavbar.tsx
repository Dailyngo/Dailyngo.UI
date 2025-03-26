import { Icon } from "@iconify/react/dist/iconify.js";
import { Menu } from "antd";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const CustomNavbar = () => {
	const pathname = usePathname();

	const menuItems = [
		{
			key: "/",
			icon: pathname === "/" ? 
				<Icon icon="mingcute:home-5-fill" width="36" height="36" className="text-black hover:text-gray-700" /> :
				<Icon icon="mingcute:home-5-line" width="36" height="36" className="text-gray-600 hover:text-gray-900" />
		},
		{
			key: "/search",
			icon: pathname === "/search" ? 
				<Icon icon="mingcute:telescope-2-fill" width="36" height="36" className="text-black hover:text-gray-700" /> :
				<Icon icon="mingcute:telescope-2-line" width="36" height="36" className="text-gray-600 hover:text-gray-900" />
		},
		{
			key: "/notifications",
			icon: pathname === "/notifications" ? 
				<Icon icon="mingcute:cellphone-vibration-fill" width="36" height="36" className="text-black hover:text-gray-700" /> :
				<Icon icon="mingcute:cellphone-vibration-line" width="36" height="36" className="text-gray-600 hover:text-gray-900" />
		},
		{
			key: "/messages",
			icon: pathname === "/messages" ? 
				<Icon icon="mingcute:message-3-fill" width="36" height="36" className="text-black hover:text-gray-700" /> :
				<Icon icon="mingcute:message-3-line" width="36" height="36" className="text-gray-600 hover:text-gray-900" />
		},
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
					className="flex justify-center border-none [&_.ant-menu-item-selected::after]:bg-transparent [&_.ant-menu-item::after]:bg-transparent [&_.ant-menu-item]:!text-gray-600 [&_.ant-menu-item-selected]:!text-black"
				>
					{menuItems.map((item) => (
						<Menu.Item
							key={item.key}
							icon={item.icon}
							className="!px-8 !text-base flex items-center !mx-0 !min-w-[80px] [&_.anticon]:!text-inherit hover:!text-gray-900"
						>
							<Link href={item.key}></Link>
						</Menu.Item>
					))}
				</Menu>
			</div>
			{/* Profile - Right Side */}
			<div className="flex-shrink-0">
				<Icon
					icon="ant-design:user-outlined"
					width="36"
					height="36"
					className="cursor-pointer text-gray-600 hover:text-gray-900"
				/>
			</div>
		</div>
	);
};

export default CustomNavbar;