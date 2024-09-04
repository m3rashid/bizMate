'use client';

import { cn } from '@/utils/helpers';
import { ChangeEvent, FC, TextareaHTMLAttributes } from 'react';

export type TextAreaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
	Icon?: FC<any>;
	errorText?: string;
	labelClassName?: string;
	descriptionText?: string;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function TextAreaInput({ label, Icon, errorText, labelClassName, descriptionText, ...props }: TextAreaInputProps) {
	return (
		<div className='w-full'>
			{label ? (
				<label htmlFor={props.name} className={cn('block text-sm font-medium leading-6 text-gray-900', labelClassName)}>
					{label}&nbsp;
					<span className='text-danger'>{props.required ? '*' : ''}</span>
				</label>
			) : null}

			{errorText ? <p className='mt-1 text-sm text-red-500'>{errorText}</p> : null}

			<div className='relative rounded-md shadow-sm'>
				{Icon ? (
					<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
						<Icon className='h-5 w-5 text-gray-400' aria-hidden='true' />
					</div>
				) : null}

				<textarea
					{...props}
					id={props.name}
					className={cn(
						'block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6',
						!Icon ? '' : 'pl-10',
						errorText ? 'text-red-500 ring-1 ring-inset ring-red-300 placeholder:text-red-300' : '',
						props.className
					)}
				/>
			</div>

			{descriptionText ? <p className='mt-1 text-sm text-gray-500'>{descriptionText}</p> : null}
		</div>
	);
}
