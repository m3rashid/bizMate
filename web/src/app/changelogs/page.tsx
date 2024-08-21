import { changelogs } from './components/data';
import { ChangelogItem } from './components/item';
import { Footer } from '@/components/home/footer';
import { FeedSequence } from '@/components/lib/feedSequence';
import { PageContainer } from '@/components/pageContainer';

export default function ChangelogsPage() {
	return (
		<PageContainer bodyClassName='bg-white flex items-center flex-col'>
			<FeedSequence items={changelogs} itemRender={ChangelogItem} title={<h1 className='mb-8 text-2xl font-semibold'>Changelogs</h1>} />
			<Footer currentRoute='/changelogs' />
		</PageContainer>
	);
}
