import { getSessionCookie } from '@/actions/auth';
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
import { redirect } from 'next/navigation';

export default async function FormPreview(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	await perfetchSingleFormById(queryClient, props.params.workspaceId, props.params.formId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId} bodyClassName='bg-white flex flex-col items-center gap-4'>
				<div className='flex w-full min-w-80 max-w-[650px] justify-end'>
					<Link href={`/${props.params.workspaceId}/forms/${props.params.formId}/designer`}>
						<Button size='small'>Go to Desginer</Button>
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
