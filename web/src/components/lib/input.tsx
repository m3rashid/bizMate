'use client';

import { cn } from '@/utils/helpers';
import EyeOpen from '@heroicons/react/20/solid/EyeIcon';
import EyeClosed from '@heroicons/react/20/solid/EyeSlashIcon';
import { ChangeEvent, FC, InputHTMLAttributes, useState } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	Icon?: FC<any>;
	errorText?: string;
	labelClassName?: string;
	descriptionText?: string;
	rootClassName?: string;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function Input({ label, Icon, errorText, labelClassName, descriptionText, rootClassName, ...props }: InputProps) {
	const [inputType, setInputType] = useState(props.type);

	return (
		<div className={cn('w-full', rootClassName)}>
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

				<input
					{...props}
					id={props.name}
					type={props.type === 'password' ? inputType : props.type}
					className={cn(
						'block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-disabled sm:text-sm sm:leading-6',
						!Icon ? '' : 'pl-10',
						props.type === 'password' ? 'pr-10' : '',
						errorText ? 'text-red-500 ring-1 ring-inset ring-red-300 placeholder:text-red-300' : '',
						props.className
					)}
				/>

				{props.type === 'password' ? (
					<div
						onClick={() => setInputType((prev) => (prev === 'password' ? 'text' : 'password'))}
						className='absolute inset-y-0 right-0 flex items-center pr-3'
					>
						{inputType === 'password' ? (
							<EyeClosed aria-hidden='true' className='h-5 w-5 cursor-pointer text-gray-400' />
						) : (
							<EyeOpen aria-hidden='true' className='h-5 w-5 cursor-pointer text-gray-400' />
						)}
					</div>
				) : null}
			</div>

			{descriptionText ? <p className='mt-1 text-sm text-gray-500'>{descriptionText}</p> : null}
		</div>
	);
}
