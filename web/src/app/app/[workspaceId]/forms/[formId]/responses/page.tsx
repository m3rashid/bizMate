import { getSessionCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { perfetchSingleFormById } from '@/api/forms/server';
import { getUserPermissionsOnServer } from '@/api/permissions/server';
import { FormResponsesTable } from '@/components/apps/forms/designer/formResponse';
import { PageNotFound, UnAuthorizedPage } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { checkPermission } from '@/hooks/checkPermission';
import { PERMISSION_READ } from '@/utils/constants';
import { isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function FormResponses(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();

	if (!isUuid(props.params.formId)) return <PageNotFound />;

	const permissions = await getUserPermissionsOnServer(queryClient, props.params.workspaceId, sessionCookie);

	if (!permissions || permissions.data.length === 0) return <UnAuthorizedPage />;
	if (!checkPermission(permissions.data, { object_type: 'form_responses', level: PERMISSION_READ })) return <UnAuthorizedPage />;

	await perfetchSingleFormById(queryClient, props.params.workspaceId, props.params.formId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId}>
				<FormResponsesTable formId={props.params.formId} workspaceId={props.params.workspaceId} />
			</PageContainer>
		</HydrationBoundary>
	);
}
