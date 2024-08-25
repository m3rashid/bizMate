import { AnalyticsList } from './components/analyticsList';
import { getSessionCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { perfetchFormAnalytics } from '@/api/forms/server';
import { getUserPermissionsOnServer } from '@/api/permissions/server';
import { PageNotFound, UnAuthorizedPage } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { checkPermission } from '@/hooks/checkPermission';
import { PERMISSION_READ } from '@/utils/constants';
import { isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function FormAnalytics(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	const permissions = await getUserPermissionsOnServer(queryClient, props.params.workspaceId, sessionCookie);
	if (!permissions || permissions.data.length === 0) return <UnAuthorizedPage />;
	if (!checkPermission(permissions.data, { object_type: 'form_analysis', level: PERMISSION_READ })) return <UnAuthorizedPage />;

	await perfetchFormAnalytics(queryClient, props.params.workspaceId, props.params.formId, sessionCookie);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId} bodyClassName='bg-white'>
				<AnalyticsList formId={props.params.formId} workspaceId={props.params.workspaceId} />
			</PageContainer>
		</HydrationBoundary>
	);
}
