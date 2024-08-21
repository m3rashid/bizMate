import { PropsWithChildren } from 'react';

export function HomeBackgroundWithSvg(props: PropsWithChildren) {
	return (
		<div className='relative isolate overflow-hidden bg-gray-100'>
			<svg
				aria-hidden='true'
				className='absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]'
			>
				<defs>
					<pattern x='50%' y={-1} id='pattern' width={200} height={200} patternUnits='userSpaceOnUse'>
						<path d='M.5 200V.5H200' fill='none' />
					</pattern>
				</defs>
				<svg x='50%' y={-1} className='overflow-visible fill-gray-500/20'>
					<path d='M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z' strokeWidth={0} />
				</svg>
				<rect fill='url(#pattern)' width='100%' height='100%' strokeWidth={0} />
			</svg>

			<div
				aria-hidden='true'
				className='absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]'
			>
				<div
					style={{
						clipPath:
							'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
					}}
					className='aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary to-primaryLight'
				/>
			</div>

			{props.children}
		</div>
	);
}
