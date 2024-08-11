import { getSessionCookie } from '@/actions/auth';
import { apiClient } from '@/api/config';
import { FormFillup } from '@/components/apps/forms/designer/fillForm';
import { PageNotFound } from '@/components/lib/notFound';
import { isUuid } from '@/utils/helpers';
import { ApiResponse, Form, NextjsPageProps } from '@/utils/types';
import FaceFrownIcon from '@heroicons/react/24/outline/FaceFrownIcon';

export default async function FillForm(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const sessionCookie = await getSessionCookie();

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	const result: ApiResponse<Form> = await apiClient(`/${props.params.workspaceId}/forms/one/${props.params.formId}`);

	if (!result || !result.data.active || (!sessionCookie && !result.data.allow_anonymous_responses)) {
		return (
			<div className='flex h-screen flex-col items-center justify-center gap-8 p-4'>
				<label className='text-3xl font-bold leading-6 text-gray-900'>
					{!result
						? 'Form not found'
						: !result.data.active
							? 'This Form is not accepting responses'
							: !sessionCookie && !result.data.allow_anonymous_responses
								? 'You need to be logged in to fill this form'
								: ''}
				</label>
				<FaceFrownIcon className='h-24 w-24' />
			</div>
		);
	}

	return (
		<div className='flex justify-center p-4'>
			<FormFillup form={result.data} workspaceId={props.params.workspaceId} />
		</div>
	);
}
