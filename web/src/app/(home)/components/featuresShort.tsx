import { features } from './featureList';

export function FeaturesShort() {
	return (
		<div className='relative isolate overflow-hidden py-24 sm:py-32'>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				loading='lazy'
				src='/hero.jpg'
				alt='Image showing people discussion'
				style={{ filter: 'brightness(0.3)' }}
				className='absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center'
			/>
			<div className='mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='mx-auto grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8'>
					{features.map((feature) => (
						<div key={feature.title} className='flex gap-x-4 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10'>
							<feature.icon aria-hidden='true' className='h-7 w-5 flex-none text-primary' />
							<div className='text-base leading-7'>
								<h3 className='text font-semibold text-white'>{feature.title}</h3>
								<p className='mt-2 text-gray-300'>{feature.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
