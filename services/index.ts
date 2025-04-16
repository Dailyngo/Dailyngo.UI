import endpoints from '@/services/endpoints';
import { IRequestModel } from '@/services/types';
import { ApiRequest, cdnRequest, refreshTokenInstance} from './request';

/**
 * @param {{id?: string, data?: D, config?: AxiosRequestConfig}}
 * @returns {Promise<AxiosResponse<any>>}
 */
/** Auth */
export const loginService: IRequestModel = (data) =>
	cdnRequest.post(endpoints.getToken(), data);
export const registerService: IRequestModel = (data) =>
	cdnRequest.post(endpoints.register(), data);
export const verifyEmailService: IRequestModel = (data) =>
	ApiRequest.post(endpoints.verifyEmail(), data);
export const sendVerificationEmail: IRequestModel = () =>
	ApiRequest.get(endpoints.sendVerificationEmail());

export const refreshTokenService: IRequestModel = (data) =>
	refreshTokenInstance.post(endpoints.getRefreshToken(), data);
export const formDataService: IRequestModel = (data) =>
	ApiRequest.put(endpoints.formDataExample(), data, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});

export const getUserInfoByIdService: IRequestModel = (data: any) =>
	ApiRequest.get(endpoints.getUserInfoById(data));
export const apiReqWithQueryService: IRequestModel = (data: any) =>
	ApiRequest.get(endpoints.apiReqWithQuery(data));

/** Post */
export const createPostService: IRequestModel = (data) =>
	ApiRequest.post(endpoints.createPost(), data);
export const getHomePagePostsService: IRequestModel = (data) =>
	ApiRequest.get(endpoints.getHomePagePosts(data));
export const getUserPostsService: IRequestModel = (data) =>
	ApiRequest.get(endpoints.getUserPosts(data));
export const deletePostService: IRequestModel = (data: any) =>
	ApiRequest.delete(endpoints.deletePost(data));

/**Comment */
export const createCommentService: IRequestModel = (data) =>
	ApiRequest.post(endpoints.createComment(), data);
export const getPostCommentsService: IRequestModel = (data: any) =>
	ApiRequest.get(endpoints.getPostComments(data));
export const deleteCommentService: IRequestModel = (data: any) =>
	ApiRequest.delete(endpoints.deleteComment(data));
