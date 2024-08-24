import { getSessionCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { getSingleFormById, perfetchSingleFormById } from '@/api/forms/server';
import { FormFillup } from '@/components/apps/forms/designer/fillForm';
import { PageNotFound } from '@/components/lib/notFound';
import { createDefaultMeta, isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

export default async function FillForm(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	await perfetchSingleFormById(queryClient, props.params.workspaceId, props.params.formId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className='flex justify-center p-4'>
				<FormFillup formId={props.params.formId} workspaceId={props.params.workspaceId} loggedIn={!!sessionCookie} />
			</div>
		</HydrationBoundary>
	);
}

export async function generateMetadata(props: NextjsPageProps<{ workspaceId: string; formId: string }>): Promise<Metadata> {
	const res = await getSingleFormById(props.params.workspaceId, props.params.formId)();
	if (!res) return createDefaultMeta('404 - Form not found');
	const description = res.data.description ? res.data.description : `Fill the ${res.data.title} form`;
	return {
		...createDefaultMeta(res.data.title, description),
		classification: 'form',
	};
}
