import { get } from 'http';
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
	getPostById: (id: string) =>  `/api/Posts/${id}`,

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
	getUserProfileCard:(data: any) => `/api/Users/profile-card?${qs.stringify(data, { skipNulls: true })}`,

	/** followers */
	createFollowRequest: () => `/api/Follow/request`,
	answerFollowRequest: () => `/api/Follow/answer`,
	getFollowUsers: (data: any) => `/api/Follow/users-list?${qs.stringify(data, { skipNulls: true })}`,
	unfollowUser: () => `/api/Follow/unfollow`,

	/** About */
    getOwnAbout: () => '/api/Abouts/about',
    getOtherAbout: (userId: string) => `/api/Abouts/other-about/${userId}`,

	/** notifications */
	getAllNotifications: () => '/api/Notification',


	/** reports */
	getAllReports: () => `/api/Reports`,
	reportPost: (id: string) => `/api/Reports/post/${id}`,
	setReportStatus: (id: string) => `/api/Reports/${id}/setprocess`,
	deletePostWithReport: (id: string) => `/api/Reports/${id}`,

	/** statistic */
	getStatistics: () => `/api/Statistics/current`,

	/** messages*/
	getAllMessages: (id: any, data: any) => `/api/Message/${id}?${qs.stringify(data, { skipNulls: true })}`,
	getAllUsersMessage: (data: any) => `/api/Message/users?${qs.stringify(data, { skipNulls: true })}`,
};
