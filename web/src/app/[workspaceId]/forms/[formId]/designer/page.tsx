import { getSessionCookie } from '@/actions/auth';
import { apiClient, getQueryClientForServer } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { FormDesignerComponent } from '@/components/apps/forms/designer';
import { PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { isUuid } from '@/utils/helpers';
import { ApiResponse, Form, NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function FormDesigner(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	await queryClient.prefetchQuery({
		queryKey: [queryKeys.singleForm],
		queryFn: () =>
			apiClient<ApiResponse<Form>>(`/${props.params.workspaceId}/forms/one/${props.params.formId}`, {
				headers: { Authorization: sessionCookie },
			}),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId} bodyClassName='p-0 sm:p-0'>
				<FormDesignerComponent formId={props.params.formId} workspaceId={props.params.workspaceId} />
			</PageContainer>
		</HydrationBoundary>
	);
}
