import {
	getUserInfoByIdService,
	loginService,
	refreshTokenService
} from '@/services';
import { AxiosResponse } from '@/services/types';
import { TStoreState } from '@/store';
import { loginHeaderConfig } from '@/utils/helpers';
import { signIn, signOut } from 'next-auth/react';
import { StateCreator } from 'zustand';
import { ERRORS } from '../errorSlice';
import jwt from 'jsonwebtoken';

const handleError = (
	err: any,
	setErrorConfirmInfoModal: Function,
	closeConfirmModal?: Function
) => {
	console.log('err', err);
	if (closeConfirmModal) {
		closeConfirmModal();
	}
	const errorTitle = err?.response?.data?.title;
	const errorMessage = err?.response?.data?.messages;
	setErrorConfirmInfoModal(
		ERRORS.GENERIC_INFO_AND_ERRORS,
		errorTitle,
		errorMessage,
		'error'
	);
};

export type LoginReqForm = {
	EmailOrUserName: string;
	Password: string;
};

export type TAuthState = {
	isAuthenticated: boolean;
	isRegistered?: boolean;
	isEmailVerified?: boolean;
	loading: boolean;
	token?: string;
	userInfoById?: any;
	/** actions */
	logout: () => void;
	login: (params: LoginReqForm, pushPage: any) => Promise<void>;
	setLoading: (isLoading: boolean) => void;
	refreshTokenReq: () => void;
	getUserById: (id: string) => void;
};

const createAuthSlice: StateCreator<TAuthState> = (set, get) => ({
	isAuthenticated: false,
	loading: false,
	isEmailVerified: false,
	isRegistered: false,
	userInfoById: {},
	/** global loading action */
	setLoading: (isLoading: boolean) => {
		set((state: TAuthState) => ({
			...state,
			loading: isLoading
		}));
	},

	logout: () => {
		set((state: TAuthState) => ({
			...state,
			isAuthenticated: false,
			token: undefined
		}));
		localStorage.clear();
		signOut();
	},
	login: async (data: LoginReqForm, pushPage) => {
		const { setLoading } = get() as TAuthState;
		setLoading(true);
		try {
			const response: AxiosResponse = await loginService(data);

			localStorage.setItem('token', response?.data?.data?.token);
			const decodedToken: any = jwt.decode(response?.data?.data?.token);
			localStorage.setItem('userId', decodedToken?.nameid);
			localStorage.setItem(
				'refreshToken',
				response?.data?.data?.refreshToken
			);
			document.cookie = `isRegistered=${response?.data?.data?.isRegistered}; path=/;`;
			document.cookie = `isEmailConfirmed=${response?.data?.data?.isEmailVerified}; path=/;`;

			const from = new URLSearchParams(window.location.search).get(
				'from'
			);
			// Decode the 'from' parameter to get the original URL

			const res = await signIn('credentials', {
				refreshToken: response?.data?.data?.refreshToken,
				token: response?.data?.data?.token,
				email: data.EmailOrUserName,
				password: data.Password,
				redirect: true,
				callbackUrl: '/'
			});

			set((state: TAuthState) => ({
				...state,
				isAuthenticated: true,
				token: response?.data?.data?.token,
				isRegistered: response?.data?.data?.isRegistered,
				isEmailVerified: response?.data?.data?.isEmailVerified
			}));
		} catch (err: any) {
			const errorTitle = err?.response?.data?.messages;
			const errorMessage = err?.response?.data?.messages;

			// Friendly Mesage burdan çağırılacak
		} finally {
			setLoading(false);
		}
	},

	refreshTokenReq: async () => {
		const { setLoading } = get() as TAuthState;
		setLoading(true);
		const refresh_token = window.localStorage.getItem('refreshToken');
		const form = {
			RefreshToken: refresh_token ? refresh_token : ''
		};
		try {
			const response: AxiosResponse = await refreshTokenService(
				form,
				loginHeaderConfig
			);

			localStorage.setItem('token', response?.data?.data?.token);
			localStorage.setItem(
				'refreshToken',
				response?.data?.data?.refreshToken
			);
			const res = await signIn('credentials', {
				refreshToken: response?.data?.data?.refreshToken,
				token: response?.data?.data?.token,
				redirect: true,
				callbackUrl: '/'
			});

			set((state: TAuthState) => ({
				...state,
				isAuthenticated: true,
				token: response?.data?.data?.token,
				permissions: response?.data?.data?.permissions
			}));
		} catch (err: any) {
			localStorage.removeItem('token');
			localStorage.removeItem('refreshToken');
			signOut();

			// Friendly Mesage burdan çağırılacak
		} finally {
			setLoading(false);
		}
	},
	getUserById: async (id: string) => {
		const { setLoading } = get() as TAuthState;
		setLoading(true);
		try {
			const response: AxiosResponse = await getUserInfoByIdService(id);
			set((state: TAuthState) => ({
				...state,
				userInfoById: response?.data.data
			}));
		} catch (err: any) {
			// handleError(err);
		} finally {
			setLoading(false);
		}
	}
});

export default createAuthSlice;
