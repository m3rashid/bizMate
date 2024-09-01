'use client';

import { FormView } from './singleFormView';
import { useGetSingleFormById, useSubmitFormResponseMutation } from '@/api/forms/client';
import { PageLoader } from '@/components/lib/loaders';
import FaceFrownIcon from '@heroicons/react/24/outline/FaceFrownIcon';
import HandThumbUpIcon from '@heroicons/react/24/outline/HandThumbUpIcon';
import { FormEvent, MouseEvent, useRef } from 'react';
import { toast } from 'sonner';

type FormFillupProps = {
	formId: string;
	workspaceId: string;
	loggedIn: boolean;
};

export const FormFillup = (props: FormFillupProps) => {
	const formRef = useRef<HTMLFormElement>(null);

	const { data: formRes, isLoading } = useGetSingleFormById(props.workspaceId, props.formId);
	const { mutate, isSuccess: formResponseSubmitted } = useSubmitFormResponseMutation(props.workspaceId, props.formId, formRef);

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
					toast.error(`"${currentFormMeta[i].props.label}" is a required field, it must have a value`);
					return;
				}
			}
			mutate({ response: formData });
		} catch (err: any) {
			toast.error(err.message || 'Unable to submit response, please try again');
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
