import { getSessionCookie } from '@/actions/auth';
import { apiClient, getQueryClientForServer } from '@/api/config';
import { getUserPermissionsOnServer } from '@/api/permissions/server';
import { queryKeys } from '@/api/queryKeys';
import { FormDesignerComponent } from '@/components/apps/forms/designer';
import { PageNotFound, UnAuthorizedPage } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { checkPermission } from '@/hooks/checkPermission';
import { PERMISSION_UPDATE } from '@/utils/constants';
import { createDefaultMeta, isUuid } from '@/utils/helpers';
import { ApiResponse, Form, NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export default async function FormDesigner(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	const permissions = await getUserPermissionsOnServer(queryClient, sessionCookie, props.params.workspaceId);
	if (!permissions || permissions.data.length === 0) return <UnAuthorizedPage />;
	if (!checkPermission(permissions.data, { object_type: 'form', level: PERMISSION_UPDATE })) return <UnAuthorizedPage />;

	await queryClient.prefetchQuery({
		queryKey: [queryKeys.singleForm],
		queryFn: () => {
			return apiClient<ApiResponse<Form>>(`/${props.params.workspaceId}/forms/one/${props.params.formId}`, {
				headers: { Authorization: sessionCookie },
			});
		},
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId} bodyClassName='p-0 sm:p-0'>
				<FormDesignerComponent formId={props.params.formId} workspaceId={props.params.workspaceId} />
			</PageContainer>
		</HydrationBoundary>
	);
}

export const metadata: Metadata = createDefaultMeta('Design forms');
