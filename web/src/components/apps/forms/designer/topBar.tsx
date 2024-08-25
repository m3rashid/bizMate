'use client';

import { useUpdateFormBodyMutation } from '@/api/forms/client';
import { FormElementType } from '@/components/apps/forms/renderer/types';
import { Button } from '@/components/lib/button';
import { Tooltip } from '@/components/lib/tooltip';
import { useFormDesigner } from '@/hooks/formDesigner';
import { usePermission } from '@/hooks/permission';
import { usePopups } from '@/hooks/popups';
import { PERMISSION_UPDATE } from '@/utils/constants';
import { StringBoolean } from '@/utils/types';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type FormDesignerTopBarProps = {
	workspaceId: string;
	formId: string;
};

export function FormDesignerTopBar(props: FormDesignerTopBarProps) {
	const router = useRouter();
	const { t } = useTranslation();
	const { addMessagePopup } = usePopups();
	const { hasPermission } = usePermission();
	const { viewType, changeViewType, formBody, rootProps } = useFormDesigner();

	const { isPending, mutate: saveForm } = useUpdateFormBodyMutation(props.workspaceId, props.formId, {
		onSuccess: () => router.push(`/${props.workspaceId}/forms/${props.formId}/preview?page=1`),
	});

	function handleSaveForm() {
		if (!hasPermission('form', PERMISSION_UPDATE)) {
			addMessagePopup({ id: 'noPermission', type: 'error', message: 'You do not have permission to update this form' });
			return;
		}

		if (formBody.length === 0) {
			addMessagePopup({ id: 'zeroLength', type: 'error', message: 'No form elements to save in the form' });
			return;
		}

		console.log(rootProps, formBody);
		const checkCondition = (val?: StringBoolean | undefined) => (val && val === 'on' ? true : false);
		const form_body: FormElementType[] = formBody.map((el) => ({
			...el,
			props: { ...el.props, ...(el.props.required ? { required: checkCondition(el.props.required) } : {}) },
		}));
		saveForm({ form_body });
	}

	return (
		<div className='mb-2 flex w-full items-center justify-between rounded-md border border-gray-200 bg-gray-100 px-3 py-2 shadow-sm'>
			<Button
				size='small'
				variant='simple'
				disabled={isPending}
				onClick={() => changeViewType()}
				label={viewType === 'build' ? 'Show Preview' : 'Designer View'}
			/>

			<div className='flex items-center gap-4'>
				<Button size='small' label='Save form' disabled={!hasPermission('form', PERMISSION_UPDATE) || isPending} onClick={handleSaveForm} />
				<Tooltip
					label={
						<ul className='block list-disc pl-4'>
							<li className='list-item'>{t('Double click on any element to select')}</li>
							<li className='list-item'>{t('Click on the elements in the left panel to add to form')}</li>
							<li className='list-item'>{t('Drag elements to re-order')}</li>
							<li className='list-item'>{t('Set Extra properties for elements in the right panel')}</li>
						</ul>
					}
				>
					<InformationCircleIcon className='h-8 w-8' />
				</Tooltip>
			</div>
		</div>
	);
}
