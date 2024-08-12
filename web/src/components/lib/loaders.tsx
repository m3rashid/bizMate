import { cn } from '@/utils/helpers';
import Image from 'next/image';

export type LoaderProps = {
	className?: string;
};

export function Loader(props: LoaderProps) {
	return (
		<div>
			<Image
				height={16}
				width={16}
				alt='Loading icon'
				src='https://www.svgrepo.com/show/70469/loading.svg'
				className={cn('h-4 w-4 animate-spin', props.className)}
			/>
		</div>
	);
}

export function PageLoader(props: LoaderProps) {
	return (
		<div className='flex h-full min-h-96 items-center justify-center'>
			<Loader {...props} className={cn('h-20 w-20', props.className)} />
		</div>
	);
}

export function SkeletonTable(props: { contentLength?: number }) {
	return (
		<div className='animate-pulse'>
			<div className='mb-4 flex justify-between'>
				{Array(2)
					.fill(1)
					.map((_, i) => (
						<div key={`skeleton-table-header-${i}`} className='h-12 w-1/4 rounded bg-skeletonDark' />
					))}
			</div>

			<div className='mb-1 bg-skeletonDark p-6'></div>
			{Array(props.contentLength ?? 10)
				.fill(1)
				.map((_, i) => (
					<div key={`skeleton-table-contents-${i}`} className='mb-1 bg-skeletonLight py-5' />
				))}
		</div>
	);
}

export function SkeletonCardList(props: { contentLength?: number }) {
	return (
		<div className='animate-pulse'>
			<div className='mb-4 flex justify-between'>
				{Array(2)
					.fill(1)
					.map((_, i) => (
						<div key={`skeleton-cardlist-header-${i}`} className='h-12 w-1/4 rounded bg-skeletonDark' />
					))}
			</div>

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{Array(props.contentLength ?? 10)
					.fill(1)
					.map((_, i) => (
						<div key={`skeleton-cardlist-contents-${i}`} className='mb-1 h-16 rounded-lg bg-skeletonLight py-5 sm:h-24 md:h-28' />
					))}
			</div>
		</div>
	);
}
