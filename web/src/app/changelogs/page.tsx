import { changelogs } from './components/data';
import { ChangelogItem } from './components/item';
import { Footer } from '@/components/home/footer';
import { FeedSequence } from '@/components/lib/feedSequence';
import { PageContainer } from '@/components/pageContainer';
import { createDefaultMeta } from '@/utils/helpers';
import { Metadata } from 'next';

export default function ChangelogsPage() {
	return (
		<PageContainer bodyClassName='flex items-center flex-col'>
			<FeedSequence items={changelogs} itemRender={ChangelogItem} title={<h1 className='mb-8 text-2xl font-semibold'>Changelogs</h1>} />
			<Footer currentRoute='/changelogs' />
		</PageContainer>
	);
}

export const metadata: Metadata = createDefaultMeta('Changelogs', 'Changelogs of Bizmate');
