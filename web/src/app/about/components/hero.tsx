import { HomeBackgroundWithSvg } from '@/components/home/homeBgSvg';

const imgClassName = 'aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg';
const imgBottomDivClassName = 'pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10';

const imagesGrid = [
	'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80',
	'https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80',
	'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80',
	'https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80',
	'https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80',
];

export function HeroSection() {
	return (
		<HomeBackgroundWithSvg>
			<div className='mx-auto max-h-[120vh] max-w-7xl px-6 pb-32 pt-16 sm:h-[calc(100vh-48px)] sm:pt-6 lg:px-8'>
				<div className='mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center'>
					<div className='w-full max-w-xl lg:shrink-0 xl:max-w-2xl'>
						<h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>We&apos;re changing the way people manage business</h1>
						<p className='relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none'>
							Managing a business is hard. Bizmate makes it easy. From project management, teams management, forms and surveys, to analytics, and much
							more. We&apos;ve got you covered.
						</p>
					</div>

					<div className='mt-16 flex justify-end gap-8 sm:-mt-36 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0'>
						<div className='ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80'>
							<div className='relative'>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img alt='Random people image' src={imagesGrid[0]} className={imgClassName} />
								<div className={imgBottomDivClassName} />
							</div>
						</div>
						<div className='mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36'>
							<div className='relative'>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img alt='Random people image' src={imagesGrid[1]} className={imgClassName} />
								<div className={imgBottomDivClassName} />
							</div>
							<div className='relative'>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img alt='Random people image' src={imagesGrid[2]} className={imgClassName} />
								<div className={imgBottomDivClassName} />
							</div>
						</div>
						<div className='w-44 flex-none space-y-8 pt-32 sm:pt-0'>
							<div className='relative'>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img alt='Random people image' src={imagesGrid[3]} className={imgClassName} />
								<div className={imgBottomDivClassName} />
							</div>
							<div className='relative'>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img alt='Random people image' src={imagesGrid[4]} className={imgClassName} />
								<div className={imgBottomDivClassName} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</HomeBackgroundWithSvg>
	);
}
