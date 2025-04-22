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
	getPostComments: (id: string) => `/api/Comments/${id}`,
	deleteComment: (id: string) => `/api/Comments/${id}`,

	/** users */
	getTodayBirthdays: () => '/api/users/birthdays',

	/** About */
    getOwnAbout: () => '/api/Abouts/about',
    getOtherAbout: (userId: string) => `/api/Abouts/other-about/${userId}`,
	/** error  */
};
