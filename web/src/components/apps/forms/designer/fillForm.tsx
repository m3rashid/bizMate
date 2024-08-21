'use client';

import { FormView } from './singleFormView';
import { apiClient } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { PageLoader } from '@/components/lib/loaders';
import { usePopups } from '@/hooks/popups';
import { ApiResponse, Form } from '@/utils/types';
import FaceFrownIcon from '@heroicons/react/24/outline/FaceFrownIcon';
import HandThumbUpIcon from '@heroicons/react/24/outline/HandThumbUpIcon';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormEvent, MouseEvent, useRef } from 'react';

type FormFillupProps = {
	formId: string;
	workspaceId: string;
	loggedIn: boolean;
};

export const FormFillup = (props: FormFillupProps) => {
	const { addMessagePopup } = usePopups();
	const formRef = useRef<HTMLFormElement>(null);

	const { data: formRes, isLoading } = useQuery({
		queryKey: [queryKeys.singleForm],
		queryFn: () => apiClient<ApiResponse<Form>>(`/${props.workspaceId}/forms/one/${props.formId}`),
	});

	const { mutate, isSuccess: formResponseSubmitted } = useMutation({
		mutationKey: ['sumitFormResponse'],
		onError: (error) => {
			console.error(error);
			addMessagePopup({ id: 'errorSubmittingResponse', message: 'Unable to submit response, please try again', type: 'error' });
		},
		onSuccess: () => {
			formRef.current?.reset();
			addMessagePopup({ id: 'responseSubmitted', message: 'Response submitted successfully', type: 'success' });
		},
		mutationFn: (data: { response: Record<string, any> }) => {
			return apiClient(`/${props.workspaceId}/forms/response/${props.formId}/submit`, { method: 'POST', data: data });
		},
	});

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any;
			const currentFormMeta = formRes?.data.form_body || [];
			const toggleInputNames = currentFormMeta.reduce<string[]>((acc, el) => (el.name === 'togglerInput' ? [...acc, el.props.name] : acc), []);
			for (let i = 0; i < toggleInputNames.length; i++)
				formData[toggleInputNames[i]] = formData[toggleInputNames[i]] && formData[toggleInputNames[i]] === 'on' ? true : false;

			for (let i = 0; i < currentFormMeta.length; i++) {
				if (typeof formData[currentFormMeta[i].props.name] === 'boolean') continue;
				if (currentFormMeta[i].props.required && !formData[currentFormMeta[i].props.name]) {
					addMessagePopup({
						id: 'missingRequiredFields',
						message: `"${currentFormMeta[i].props.label}" is a required field, it must have a value`,
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

	if (isLoading) return <PageLoader />;

	if (!formRes || !formRes.data.active || (!props.loggedIn && !formRes.data.allow_anonymous_responses)) {
		return (
			<div className='flex h-screen flex-col items-center justify-center gap-8 p-4'>
				<label className='text-3xl font-bold leading-6 text-gray-900'>
					{!formRes
						? 'Form not found'
						: !formRes.data.active
							? 'This Form is not accepting responses'
							: !props.loggedIn && !formRes.data.allow_anonymous_responses
								? 'You need to be logged in to fill this form'
								: ''}
				</label>
				<FaceFrownIcon className='h-24 w-24' />
			</div>
		);
	}

	return formResponseSubmitted ? (
		<div className='flex h-[calc(100vh-48px)] items-center justify-center'>
			<div className='flex items-center gap-4 rounded-lg bg-successLight p-4 px-16'>
				<HandThumbUpIcon className='h-8 w-8 animate-bounce' />
				<h1>Your response was recorded</h1>
			</div>
		</div>
	) : (
		<FormView formRef={formRef} type='fill' form={formRes.data} onSubmitClick={handleSubmit} onCancelClick={handleCancel} />
	);
};
