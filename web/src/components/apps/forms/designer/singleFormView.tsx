import FormBuilder from '@/components/apps/forms/renderer';
import { Button } from '@/components/lib/button';
import { Form } from '@/utils/types';
import { FormEvent, MouseEvent, RefObject } from 'react';

export type FormViewProps = {
	form?: Form;
} & (
	| { type: 'preview' }
	| {
			type: 'fill';
			formRef: RefObject<HTMLFormElement>;
			onSubmitClick: (e: FormEvent<HTMLFormElement>) => void;
			onCancelClick: (e: MouseEvent<HTMLButtonElement>) => void;
	  }
);

export function FormView(props: FormViewProps) {
	if (!props.form) return null;

	return (
		<form
			className='mb-8 flex w-full min-w-80 max-w-[650px] flex-col gap-4'
			{...(props.type === 'fill' ? { ref: props.formRef, onSubmit: props.onSubmitClick } : {})}
		>
			<FormBuilder formBody={props.form.form_body} className='flex flex-col gap-4 rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md' />
			<div className='flex items-center justify-between rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md'>
				<Button
					variant='simple'
					label={props.form.cancel_text}
					{...(props.type === 'fill' ? { onClick: props.onCancelClick } : { disabled: true })}
				/>
				<Button type='submit' variant='primary' label={props.form.submit_text} {...(props.type === 'preview' ? { disabled: true } : {})} />
			</div>
		</form>
	);
}
