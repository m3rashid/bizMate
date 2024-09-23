import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import Link from 'next/link';
import { ReactNode } from 'react';

export type NotFoundProps = {
	title?: string;
	code?: number;
	description?: string;
	hideExtras?: boolean;
	hideCode?: boolean;
	customExtras?: ReactNode;
};

export function NotFound({ ...props }: NotFoundProps) {
	return (
		<main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
			<div className='text-center'>
				{!props.hideCode ? <p className='text-base font-semibold text-primary'>{props.code || '404'}</p> : null}
				<h1 className='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>{props.title || 'Page not found'}</h1>
				<p className='mt-6 text-base leading-7 text-gray-600'>{props.description || 'Sorry, we couldn’t find the page you’re looking for'}</p>

				{!props.hideExtras ? (
					<div className='mt-10 flex items-center justify-center gap-x-6'>
						<Link
							href='/'
							className='rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primaryLight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryLight'
						>
							Go back home
						</Link>

						<Link href='/support' className='flex items-center justify-center gap-2 text-sm font-semibold leading-6'>
							<span>Contact support</span>
							<ArrowRightIcon className='h-4 animate-pulse' />
						</Link>
					</div>
				) : null}

				{props.customExtras}
			</div>
		</main>
	);
}

export function PageNotFound(props: NotFoundProps) {
	return (
		<div className='flex h-full min-h-96 items-center justify-center'>
			<NotFound {...props} />
		</div>
	);
}

export function UnAuthorized(props: NotFoundProps) {
	return <NotFound code={401} title='Unauthorized' {...props} />;
}

export function UnAuthorizedPage(props: NotFoundProps) {
	return (
		<div className='flex h-full min-h-96 items-center justify-center'>
			<UnAuthorized description='Sorry, you are not authorized to view this page' {...props} />
		</div>
	);
}

export function ComingSoon(props: NotFoundProps) {
	return (
		<div className='flex h-full min-h-96 items-center justify-center'>
			<NotFound description='Coming soon' hideExtras hideCode {...props} />
		</div>
	);
}

export function WorkspaceNotFound(props: NotFoundProps) {
	return (
		<div className='flex h-full min-h-96 items-center justify-center'>
			<NotFound title='Workspace not found' description='Sorry, we couldn’t find the page you’re looking for' {...props} />
		</div>
	);
}
