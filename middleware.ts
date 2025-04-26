import { getToken } from 'next-auth/jwt';
import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import axios from 'axios';
import endpoints from './services/endpoints';
import { ENVIRONMENT } from './configurations';

function clearAuthCookies(response: NextResponse) {
	const cookieNames = [
		'next-auth.session-token',
		'__Secure-next-auth.session-token',
		'next-auth.csrf-token'
	];
	cookieNames.forEach(name => {
		response.cookies.set(name, '', { 
			path: '/', 
			maxAge: 0,
			secure: true,      // <<< BU SATIRI EKLEDİK
			sameSite: 'lax',   // <<< opsiyonel, next-auth genelde lax kullanıyor
			httpOnly: true     // <<< opsiyonel, güvenlik için
		});
	});
	return response;
}

export default withAuth(
	async function middleware(req: NextRequestWithAuth) {
		console.log('[Middleware] Started for path:', req.nextUrl.pathname);

		const token = await getToken({ req });
		const isAuth = !!token;
		const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
		 req.nextUrl.pathname.startsWith('/register');

		if (isAuth) {
			console.log('[Middleware] User is authenticated. Verifying email status...');

			try {
				const axiosInstance = axios.create({
					baseURL: ENVIRONMENT.baseURL,
					headers: {
						Authorization: `Bearer ${token?.token}`
					}
				});
				const { data } = await axiosInstance.get(endpoints.userLoginInfo());
				const isEmailVerified = data.data.isEmailConfirmed;
				const currentPath = req.nextUrl.pathname;

				if (currentPath.startsWith('/verifyEmail')) {
					if (isEmailVerified) {
						console.log('[Middleware] Email already verified, redirecting to home.');
						return NextResponse.redirect(new URL('/', req.url));
					}
					console.log('[Middleware] On verifyEmail page and email not verified yet. Allowing access.');
					return null;
				}

				if (!isEmailVerified) {
					console.log('[Middleware] Email not verified, redirecting to verifyEmail page.');
					return NextResponse.redirect(new URL('/verifyEmail', req.url));
				}

				console.log('[Middleware] Email verified, proceeding.');
				return null;
			} catch (error: any) {
				if (error?.response?.status === 401) {
					console.log('[Middleware] 401 Unauthorized detected, clearing cookies and redirecting to login.');
					const redirectUrl = new URL('/login', req.url);
					let response = NextResponse.redirect(redirectUrl);
					response = clearAuthCookies(response);
					return response;
				} else {
					console.error('[Middleware] Error fetching user info:', error.message);
				}
			}
		}

		if (isAuthPage) {
			if (isAuth) {
				console.log('[Middleware] Authenticated user tried to access auth page. Redirecting to home.');
				return NextResponse.redirect(new URL('/', req.url));
			}
			console.log('[Middleware] On auth page and not authenticated. Allowing access.');
			return null;
		}

		if (!isAuth) {
			console.log('[Middleware] User not authenticated. Redirecting to login.');
			return NextResponse.redirect(new URL('/login', req.url));
		}

		console.log('[Middleware] No special action required. Proceeding.');
		return null;
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
