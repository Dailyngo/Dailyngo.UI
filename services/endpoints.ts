import qs from 'qs';

export default {
	/** auth  */
	getToken: () => '/api/auth/login',
	register: () => '/api/auth/register',
	getUserInfoById: (id: string) => `/api/auth/User/${id}`,
	getRefreshToken: () => `/api/Auth/refresh-token`,
	apiReqWithQuery: (data: any) =>
		`/api/pagination/example/?${qs.stringify(data, { skipNulls: true })}`,
	formDataExample: () => `/api/example/formdata/-token`
	/** error  */
};
