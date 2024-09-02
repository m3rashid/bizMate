'use client';

import { cn } from '@/utils/helpers';
import { Field, Label, Switch, SwitchProps } from '@headlessui/react';
import { ForwardedRef, ReactNode, forwardRef, useImperativeHandle, useState } from 'react';

export type TogglerProps = SwitchProps & {
	label?: ReactNode;
	className?: string;
	required?: boolean;
	descriptionText?: string;
};

function Component({ label, className, descriptionText, ...props }: TogglerProps, ref: ForwardedRef<{ getValue: () => boolean }>) {
	const [enabled, setEnabled] = useState(props.defaultChecked ?? false);

	useImperativeHandle(ref, () => ({
		getValue: () => enabled,
	}));

	return (
		<div>
			<Field as='div' className='flex items-center'>
				<Switch
					{...props}
					checked={enabled}
					onChange={setEnabled}
					className={cn(
						'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
						enabled ? 'bg-indigo-600' : 'bg-gray-200',
						className
					)}
				>
					<span
						className={cn(
							'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
							enabled ? 'translate-x-5' : 'translate-x-0'
						)}
					/>
				</Switch>

				{label ? (
					<Label as='span' className='ml-3 text-sm'>
						{props.required ? <span className='text-red-500'>*</span> : null}
						{label}
					</Label>
				) : null}
			</Field>

			{descriptionText ? <p className='mt-1 text-sm text-gray-500'>{descriptionText}</p> : null}
		</div>
	);
}

export const TogglerInput = forwardRef(Component);
