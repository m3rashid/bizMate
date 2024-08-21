import { PageContainer } from '@/components/pageContainer';
import { createDefaultMeta } from '@/utils/helpers';
import { Metadata } from 'next';

export default async function Feedback() {
	return (
		<PageContainer bodyClassName='bg-white'>
			<div>Feedback</div>
		</PageContainer>
	);
}

export const metadata: Metadata = createDefaultMeta('Feedback', 'Give your feedback for Bizmate');
