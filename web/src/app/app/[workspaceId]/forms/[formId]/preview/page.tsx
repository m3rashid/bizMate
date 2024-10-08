import { apiClient, getQueryClientForServer } from '@/api/config';
import { perfetchSingleFormById } from '@/api/forms/server';
import { PreviewForm } from '@/components/apps/forms/designer/previewForm';
import { Button } from '@/components/lib/button';
import { PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { createDefaultMeta, isUuid } from '@/utils/helpers';
import { ApiResponse, Form, NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Link from 'next/link';

export default async function FormPreview(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const queryClient = getQueryClientForServer();
	if (!isUuid(props.params.formId)) return <PageNotFound />;

	await perfetchSingleFormById(queryClient, props.params.workspaceId, props.params.formId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId} bodyClassName='flex flex-col items-center gap-4'>
				<div className='flex w-full min-w-80 max-w-[650px] justify-between'>
					<Link href={`/app/${props.params.workspaceId}/forms`}>
						<Button size='small' variant='simple'>
							Back to Forms
						</Button>
					</Link>
					<Link href={`/app/${props.params.workspaceId}/forms/${props.params.formId}/designer`}>
						<Button size='small'>Go to Designer</Button>
					</Link>
				</div>

				<PreviewForm formId={props.params.formId} workspaceId={props.params.workspaceId} />
			</PageContainer>
		</HydrationBoundary>
	);
}

export async function generateMetadata(props: NextjsPageProps<{ workspaceId: string; formId: string }>): Promise<Metadata> {
	const res = await apiClient<ApiResponse<Form>>(`/${props.params.workspaceId}/forms/one/${props.params.formId}`);
	if (!res) return createDefaultMeta('404 - Form not found');
	return createDefaultMeta(res.data.title, res.data.description);
}
