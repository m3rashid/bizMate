import { sessionTokenExpired } from './utils/helpers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const sessionCookie = request.cookies.get('token')?.value || null;
	const isUserLoggedIn = !!sessionCookie && !sessionTokenExpired(sessionCookie);

	const loggedOutPaths = ['/auth/login', '/auth/register'];
	const publicPaths = ['/', '/about', '/changelogs', '/feedback', '/pricing', '/terms', '/privacy', '/contact'];

	if (isUserLoggedIn) {
		if (loggedOutPaths.includes(path)) {
			return NextResponse.redirect(new URL('/app', request.url));
		}

		// check workspaces and all that shit
		return NextResponse.next();
	} else {
		if (!publicPaths.includes(path)) {
			request.cookies.delete('token');
			if (loggedOutPaths.includes(path)) return NextResponse.next();
			return NextResponse.redirect(new URL('/auth/login', request.url));
		}
	}
}

export const config = {
	matcher: [
		'/',
		'/about',
		'/changelogs',
		'/feedback',
		'/pricing',
		'/terms',
		'/privacy',
		'/contact',
		//
		'/auth/login',
		'/auth/register',
		//
		'/app',
		'/app/:workspaceId',
		//
		'/app/:workspaceId/admin',
		'/app/:workspaceId/admin/add-role',
		'/app/:workspaceId/admin/edit-role/:roleId',
		//
		'/app/:workspaceId/forms',
		'/app/:workspaceId/forms/:formId',
		'/app/:workspaceId/forms/:formId/analytics',
		'/app/:workspaceId/forms/:formId/designer',
		'/app/:workspaceId/forms/:formId/preview',
		'/app/:workspaceId/forms/:formId/responses',
	],
};
