import { apiClient } from '@/api/config';
import FormRenderer from '@/components/apps/forms/renderer';
import { FormElementType as FormElementInstance, SupportedWidgetName } from '@/components/apps/forms/renderer/types';
import { Button } from '@/components/lib/button';
import { Modal } from '@/components/lib/modal';
import { usePopups } from '@/hooks/popups';
import { snakeCaseToSentenceCase } from '@/utils/helpers';
import { Form, StringBoolean } from '@/utils/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo } from 'react';

export type AddEditFormProps = { open: boolean; onClose: () => void; workspaceId: string; refetch: () => void } & (
	| { form: undefined }
	| { form: Form }
);

type EditFormBody = Array<[keyof Form, string | boolean, string, SupportedWidgetName, boolean?, Record<string, any>?]>;
function editFormBody(form: EditFormBody) {
	// Array<[name, value, descriptionText, type, required]>
	const formBody: FormElementInstance[] = [];
	for (let i = 0; i < form.length; i++) {
		formBody.push({
			id: form[i][0],
			name: form[i][3],
			props: {
				name: form[i][0],
				required: form[i][4],
				defaultValue: form[i][1],
				descriptionText: form[i][2],
				label: snakeCaseToSentenceCase(form[i][0]),
				...(form[i][5] || {}),
			},
		});
	}

	return formBody;
}

function AddEditForm(props: AddEditFormProps) {
	const router = useRouter();
	const { addMessagePopup } = usePopups();

	const { mutate: createForm } = useMutation({
		mutationKey: ['createForm'],
		mutationFn: (form: Partial<Form>) => apiClient(`/${props.workspaceId}/forms/create`, { method: 'POST', data: form }),
		onSuccess: (data) => {
			props.onClose();
			addMessagePopup({ id: 'successCreatingForm', message: 'Form created successfully', type: 'success' });
			router.push(`/${props.workspaceId}/forms/${data.data}/designer`);
		},
		onError: () => {
			addMessagePopup({ id: 'errorCreatingForm', message: 'An Error occured in creating form', type: 'error' });
		},
	});

	const { mutate: updateForm } = useMutation({
		mutationKey: ['editForm'],
		mutationFn: (form: Partial<Form>) => apiClient(`/${props.workspaceId}/forms/update`, { method: 'POST', data: form }),
		onSuccess: () => {
			props.onClose();
			addMessagePopup({ id: 'successUpdatingForm', message: 'Form updated successfully', type: 'success' });
			props.refetch();
		},
		onError: () => {
			addMessagePopup({ id: 'errorUpdatingForm', message: 'An Error occured in updating form', type: 'error' });
		},
	});

	const formBody = useMemo(() => {
		const _formBody: EditFormBody = [
			['title', props.form?.title || '', 'Form title', 'input', true],
			['description', props.form?.description || '', 'Form description', 'textareaInput'],
			['submit_text', props.form?.submit_text || 'Submit', 'Text on the submit button', 'input', false],
			['cancel_text', props.form?.cancel_text || 'Cancel', 'Text on the cancel button', 'input', false],
			[
				'allow_anonymous_responses',
				props.form?.allow_anonymous_responses ? 'on' : 'off',
				'Does the user need to be logged in to fill this form?',
				'togglerInput',
				true,
				{ defaultChecked: props.form?.allow_anonymous_responses },
			],
			[
				'allow_multiple_responses',
				props.form?.allow_multiple_responses ? 'on' : 'off',
				'Can the user submit multiple responses?',
				'togglerInput',
				true,
				{ defaultChecked: props.form?.allow_multiple_responses },
			],
		];

		if (props.form) {
			_formBody.push([
				'active',
				props.form.active ? 'on' : 'off',
				'Is this form active',
				'togglerInput',
				true,
				{ defaultChecked: props.form.active },
			]);
		}

		return editFormBody(_formBody);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.form?.id]);

	function handleStringBoolean(entry?: StringBoolean) {
		return entry && entry === 'on' ? true : false;
	}

	function handleAddEditForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any;
		const form: Partial<Form> = {
			...(props.form ? { ...props.form, id: props.form.id } : {}),
			...formData,
			allow_anonymous_responses: handleStringBoolean(formData.allow_anonymous_responses),
			allow_multiple_responses: handleStringBoolean(formData.allow_multiple_responses),
			active: handleStringBoolean(formData.active),
		};
		if (!props.form) createForm(form);
		else updateForm(form);
	}

	return (
		<Modal open={props.open} setOpen={props.onClose} title={!!props.form ? `Edit Form (${props.form.title})` : 'Create new form'}>
			<form className='h-full' onSubmit={handleAddEditForm}>
				<FormRenderer formBody={formBody} className='flex h-full max-h-96 flex-grow flex-col gap-4 overflow-y-auto p-4' />

				<div className='flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2'>
					<Button variant='simple' type='reset'>
						Reset
					</Button>
					<Button type='submit'>Save</Button>
				</div>
			</form>
		</Modal>
	);
}

export default AddEditForm;
