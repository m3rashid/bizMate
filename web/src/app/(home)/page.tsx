import { FeaturesShort } from './components/featuresShort';
import { Hero } from './components/hero';
import { Footer } from '@/components/home/footer';
import { PageContainer } from '@/components/pageContainer';
import { createDefaultMeta } from '@/utils/helpers';
import { Metadata } from 'next';

export default async function HomePage() {
	return (
		<PageContainer bodyClassName='p-0 sm:p-0 bg-white hide-scrollbar'>
			<Hero />
			<FeaturesShort />
			<Footer currentRoute='/' />
		</PageContainer>
	);
}

export const metadata: Metadata = createDefaultMeta('Home');
