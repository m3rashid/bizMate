import { checkWorkspace, isUuid, sessionTokenExpired } from './utils/helpers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function checkIfWorkspaceIdIsValid(fullPath: string) {
	const pathParams = fullPath.split('/app')[1];
	if (!pathParams) {
		return true;
		//
		// it is the /app route
	} else {
		const workspaceId = pathParams.split('/')[1];
		if (!isUuid(workspaceId)) return false;
		const res = await checkWorkspace(workspaceId);
		return !!res;
	}
}

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const sessionCookie = request.cookies.get('token')?.value || null;
	const isUserLoggedIn = !!sessionCookie && !sessionTokenExpired(sessionCookie);

	const loggedOutPaths = ['/auth/login', '/auth/register'];
	const publicPaths = ['/', '/about', '/changelogs', '/feedback', '/pricing', '/terms', '/privacy', '/contact'];

	if (path.includes('/forms')) {
		const formParams = path.split('/forms')[1].split('/'); // ['', 'formId', 'something'?]
		if (formParams.length === 2) {
			const isWorkspaceValid = await checkIfWorkspaceIdIsValid(path);
			if (!isWorkspaceValid) return NextResponse.rewrite(new URL('/app/not-found', request.url));
			return NextResponse.next(); // do not check for login on the form fillup page
		}
	}

	if (isUserLoggedIn) {
		if (loggedOutPaths.includes(path)) return NextResponse.redirect(new URL('/app', request.url));
		if (path.includes('/app')) {
			const isWorkspaceValid = await checkIfWorkspaceIdIsValid(path);
			if (!isWorkspaceValid) return NextResponse.rewrite(new URL('/app/not-found', request.url));
		}
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
		'/app/:workspaceId*',
	],
};
