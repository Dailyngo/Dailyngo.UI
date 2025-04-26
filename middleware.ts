import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';
import endpoints from './services/endpoints';
import { ENVIRONMENT } from './configurations';

export default withAuth(
	async function middleware(req: NextRequestWithAuth) {
		const token = await getToken({ req });
		const isAuth = !!token;
		const isAuthPage =
			req.nextUrl.pathname.startsWith('/login') ||
			req.nextUrl.pathname.startsWith('/register');

		if(isAuth){
			try {
				const axiosInstance = axios.create({
					baseURL: ENVIRONMENT.baseURL,
					headers: {
						Authorization: token ? `Bearer ${token.token}` : undefined
					}
				});
				const response: AxiosResponse = await axiosInstance.get(endpoints.userLoginInfo());
				const isEmailVerified = response.data.data.isEmailConfirmed;
				const currentPath = req.nextUrl.pathname;
				
				// 1. Önce kullanıcının bulunduğu sayfaya göre kontrol yap
				if (currentPath.startsWith("/verifyEmail")) {
					if (isEmailVerified) {
					// Zaten doğrulanmışsa ana sayfaya yönlendir
						return NextResponse.redirect(new URL("/", req.url));
					}
					// Doğrulama sayfasında ve doğrulanmamışsa izin ver
					return null;
				}

				// 2. Gerekli doğrulamaları yap
				if (!isEmailVerified) {
					console.log("Email not verified - redirecting");
					return NextResponse.redirect(new URL("/verifyEmail", req.url));
				}
				
				return null;
			} catch (error : any) {
				if(error.status == 401){
					console.log("error",error.status);
					if (!isAuthPage) {
						const redirectUrl = new URL('/login', req.url);
						const response = NextResponse.redirect(redirectUrl);

						await req.cookies.getAll().forEach((cookie) => {
							response.cookies.delete(cookie.name);
						});
						return response;
					}
				}
			} 
		}

		if (isAuthPage) {
			if (isAuth) {
				return NextResponse.redirect(new URL('/', req.url));
			}

			return null;
		}
		if (isAuth && req.nextUrl.pathname.startsWith('/login')) {
			return NextResponse.redirect(new URL('/', req.url));
		}

		if (!isAuth) {
			let from = req.nextUrl.pathname;
			if (req.nextUrl.search) {
				from += req.nextUrl.search;
			}

			return NextResponse.redirect(
				//  new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
				new URL(`/login`, req.url)
			);
		}

		// return roleAuth(req);
	},
	{
		callbacks: {
			async authorized() {
				return true;
			}
		}
	}
);

export const config = {
	matcher: '/((?!images).*)'
};
