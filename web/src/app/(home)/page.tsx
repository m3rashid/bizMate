import { FeaturesShort } from './components/featuresShort';
import { Hero } from './components/hero';
import { Footer } from '@/components/home/footer';
import { PageContainer } from '@/components/pageContainer';

export default async function HomePage() {
	return (
		<PageContainer bodyClassName='p-0 sm:p-0 bg-white hide-scrollbar'>
			<Hero />
			<FeaturesShort />
			<Footer currentRoute='/' />
		</PageContainer>
	);
}
