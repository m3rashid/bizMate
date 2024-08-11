import { getSessionCookie } from '@/actions/auth';
import { apiClient } from '@/api/config';
import { PreviewForm } from '@/components/apps/forms/designer/previewForm';
import { Button } from '@/components/lib/button';
import { PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { isUuid } from '@/utils/helpers';
import { ApiResponse, Form, NextjsPageProps } from '@/utils/types';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function FormPreview(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	const result: ApiResponse<Form> = await apiClient(`/${props.params.workspaceId}/forms/one/${props.params.formId}`, {
		headers: { Authorization: sessionCookie },
	});

	return (
		<PageContainer workspaceId={props.params.workspaceId} bodyClassName='bg-white flex flex-col items-center gap-4'>
			<div className='flex w-full min-w-80 max-w-[650px] justify-end'>
				<Link href={`/${props.params.workspaceId}/forms/${props.params.formId}/designer`}>
					<Button size='small'>Go to Desginer</Button>
				</Link>
			</div>

			<PreviewForm form={result.data} />
		</PageContainer>
	);
}
