import { send } from 'process';
import qs from 'qs';

export default {
	/** auth  */
	getToken: () => '/api/auth/login',
	register: () => '/api/auth/register',
	verifyEmail: () => '/api/auth/verify-email',
	sendVerificationEmail: () => '/api/auth/send-verification-email',
	userLoginInfo: () => '/api/auth/user-login-info',
	getUserInfoById: (id: string) => `/api/auth/User/${id}`,
	getRefreshToken: () => `/api/Auth/refresh-token`,
	apiReqWithQuery: (data: any) =>
		`/api/pagination/example/?${qs.stringify(data, { skipNulls: true })}`,
	formDataExample: () => `/api/example/formdata/-token`,
	/** post */
	createPost: () => '/api/Posts',
	getHomePagePosts: (data: any) => `/api/Posts/homepage?${qs.stringify(data, { skipNulls: true })}`,
	getUserPosts: (data: any) => `/api/Posts?${qs.stringify(data, { skipNulls: true })}`,
	deletePost: (id: string) => `/api/Posts/${id}`,

	/** Comment */
	createComment: () => '/api/Comments',
	getPostComments: (id: string,data: any) => `/api/Comments/${id}?${qs.stringify(data, { skipNulls: true })}`,
	deleteComment: (id: string) => `/api/Comments/${id}`,

	/** Like */
	getPostLikes: (id: string, data: any) => `/api/Likes/${id}?${qs.stringify(data, { skipNulls: true })}`,
	addLike: (id: string) => `/api/Likes/${id}`,
	removeLike: (id: string) => `/api/Likes/${id}`,

	/** users */
	getTodayBirthdays: () => '/api/users/birthdays',
	searchUsers:(data: any)	=> `/api/users/search?${qs.stringify(data, { skipNulls: true })}`,


	/** followers */
	createFollowRequest: () => `/api/Follow/request`,
};
