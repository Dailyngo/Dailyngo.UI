import endpoints from '@/services/endpoints';
import { IRequestModel } from '@/services/types';
import { ApiRequest, cdnRequest, refreshTokenInstance } from './request';

/**
 * @param {{id?: string, data?: D, config?: AxiosRequestConfig}}
 * @returns {Promise<AxiosResponse<any>>}
 */
/** Auth */
export const loginService: IRequestModel = (data) =>
	cdnRequest.post(endpoints.getToken(), data);
export const registerServive: IRequestModel = (data) =>
	cdnRequest.post(endpoints.register(), data);

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
