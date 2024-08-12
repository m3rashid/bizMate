import { apiClient } from '@/api/config';
import { FormElementType } from '@/components/apps/forms/renderer/types';
import { Button } from '@/components/lib/button';
import { Tooltip } from '@/components/lib/tooltip';
import { useFormDesigner } from '@/hooks/formDesigner';
import { usePopups } from '@/hooks/popups';
import { StringBoolean } from '@/utils/types';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type FormDesignerTopBarProps = {
	workspaceId: string;
	formId: string;
};

export function FormDesignerTopBar(props: FormDesignerTopBarProps) {
	const { t } = useTranslation();
	const router = useRouter();
	const { addMessagePopup } = usePopups();
	const { viewType, changeViewType, formBody, rootProps } = useFormDesigner();

	const { isPending, mutate: saveForm } = useMutation({
		mutationKey: ['saveForm', props.workspaceId],
		onError: () => addMessagePopup({ id: 'errorCreateForm', message: 'Error in creating form', type: 'error' }),
		mutationFn: async (body: any) =>
			apiClient(`/${props.workspaceId}/forms/${props.formId}/update-form-body`, { method: 'POST', body: JSON.stringify(body) }),
		onSuccess: () => {
			addMessagePopup({ id: 'saveForm', message: 'Successfully created form', type: 'success' });
			router.push(`/${props.workspaceId}/forms/${props.formId}/preview?page=1`);
		},
	});

	function handleSaveForm() {
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
				<Button size='small' label='Save form' disabled={isPending} onClick={handleSaveForm} />
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
