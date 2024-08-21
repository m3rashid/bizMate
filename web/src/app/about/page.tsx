import { HeroSection } from './components/hero';
import { VisionMissionSection } from './components/visionMission';
import { Footer } from '@/components/home/footer';
import { PageContainer } from '@/components/pageContainer';

const teamImage =
	'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80';

function AboutPage() {
	return (
		<PageContainer bodyClassName='bg-white p-0 sm:p-0 hide-scrollbar isolate'>
			<HeroSection />
			<VisionMissionSection />

			<div className='mt-16 sm:mt-24 xl:mx-auto xl:max-w-7xl xl:px-8'>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img alt='' src={teamImage} className='aspect-[5/2] w-full object-cover xl:rounded-3xl' />
			</div>

			{/* Team section */}
			{/* <div className='mx-auto mt-16 max-w-7xl px-6 sm:mt-24 lg:px-8'>
				<div className='mx-auto max-w-2xl lg:mx-0'>
					<h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Our team</h2>
					<p className='mt-6 text-lg leading-8 text-gray-600'>
						Sit facilis neque ab nulla vel. Cum eos in laudantium. Temporibus eos totam in dolorum. Nemo vel facere repellendus ut eos dolores
						similique.
					</p>
				</div>
				<ul
					role='list'
					className='mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6'
				>
					{team.map((person) => (
						<li key={person.name}>
							<img alt='' src={person.imageUrl} className='mx-auto h-24 w-24 rounded-full' />
							<h3 className='mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900'>{person.name}</h3>
							<p className='text-sm leading-6 text-gray-600'>{person.role}</p>
						</li>
					))}
				</ul> 
			</div> */}
			<Footer currentRoute='/about' />
		</PageContainer>
	);
}

export default AboutPage;
