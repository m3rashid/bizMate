import { HomeBackgroundWithSvg } from '@/components/home/homeBgSvg';
import { BrandLogo } from '@/components/lib/brandLogo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function Hero() {
	return (
		<HomeBackgroundWithSvg>
			<div className='mx-auto h-[calc(100vh-48px)] max-w-7xl px-6 py-20 lg:flex lg:px-8'>
				<div className='mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8'>
					<BrandLogo className='w-fit' imgClassName='h-20 w-20' />

					<h1 className='mt-10 text-4xl font-bold tracking-tight sm:text-6xl'>Manage your organization with confidence</h1>
					<p className='mt-6 text-lg leading-8 text-gray-700'>
						Bizmate covers all your business needs, from project management, teams management, forms and surveys, to analytics, reporting and much
						more
					</p>
					<div className='mt-10 flex items-center gap-x-6'>
						<Link
							href='/auth/login'
							className='rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primaryLight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryLight'
						>
							Get started
						</Link>
						<Link href='/about' className='flex items-center justify-center gap-2 text-sm font-semibold leading-6'>
							<span>Learn more</span>
							<ArrowRightIcon className='h-4 animate-pulse' />
						</Link>
					</div>
				</div>
				{/* <div className='mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32'>
					<div className='max-w-3xl flex-none sm:max-w-5xl lg:max-w-none'>
						<img
							alt='App screenshot'
							src='https://tailwindui.com/img/component-images/dark-project-app-screenshot.png'
							className='w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10'
						/>
					</div>
				</div> */}
			</div>
		</HomeBackgroundWithSvg>
	);
}
