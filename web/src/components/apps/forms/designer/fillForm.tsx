'use client';

import { FormView } from './singleFormView';
import { apiClient } from '@/api/config';
import { usePopups } from '@/hooks/popups';
import { Form } from '@/utils/types';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, MouseEvent, useRef } from 'react';

type FormFillupProps = {
	form: Form;
	workspaceId: string;
};

export const FormFillup = (props: FormFillupProps) => {
	const { addMessagePopup } = usePopups();
	const formRef = useRef<HTMLFormElement>(null);

	const { mutate } = useMutation({
		mutationKey: ['sumitFormResponse'],
		onError: (error) => console.error(error),
		onSuccess: () => formRef.current?.reset(),
		mutationFn: (data: { response: Record<string, any> }) => {
			return apiClient(`/${props.workspaceId}/forms/response/${props.form.id}/submit`, { method: 'POST', body: JSON.stringify(data) });
		},
	});

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any;
			// const currentFormMeta = props.form.form_body;
			const toggleInputNames = props.form.form_body.reduce<string[]>((acc, el) => (el.name === 'togglerInput' ? [...acc, el.props.name] : acc), []);
			for (let i = 0; i < toggleInputNames.length; i++)
				formData[toggleInputNames[i]] = formData[toggleInputNames[i]] && formData[toggleInputNames[i]] === 'on' ? true : false;

			for (let i = 0; i < props.form.form_body.length; i++) {
				if (typeof formData[props.form.form_body[i].props.name] === 'boolean') continue;
				if (props.form.form_body[i].props.required && !formData[props.form.form_body[i].props.name]) {
					addMessagePopup({
						id: 'missingRequiredFields',
						message: `"${props.form.form_body[i].props.label}" is a required field, it must have a value`,
						type: 'error',
					});
					return;
				}
			}
			mutate({ response: formData });
		} catch (err: any) {
			addMessagePopup({ id: 'errorSubmittingResponse', message: 'Unable to submit response, please try again', type: 'error' });
		}
	}

	function handleCancel(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		formRef.current?.reset();
	}

	return <FormView formRef={formRef} type='fill' form={props.form} onSubmitClick={handleSubmit} onCancelClick={handleCancel} />;
};
