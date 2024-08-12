import { cn } from '@/utils/helpers';
import { filterBykeys } from '@/utils/helpers';
import { ButtonHTMLAttributes, ReactNode } from 'react';

const buttonVariants = {
	primary: 'bg-primary hover:bg-primary focus-visible:outline-primary',
	danger: 'bg-danger hover:bg-danger focus-visible:outline-danger',
	secondary: 'bg-secondary hover:bg-secondary focus-visible:outline-secondary',
	disabled: 'bg-disabled hover:bg-disabled focus-visible:outline-disabled',
	sucess: 'bg-success hover:bg-success focus-visible:outline-success',
	simple: 'bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-gray-200 border border-gray-300',
} as const;

const buttonSizes = {
	small: 'px-3 py-1.5 text-sm',
	medium: 'px-5 py-2 text-base',
	large: 'px-7 py-2 text-base',
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	LeftIcon?: ReactNode;
	RightIcon?: ReactNode;
	variant?: keyof typeof buttonVariants;
	label?: string;
	size?: keyof typeof buttonSizes;
};

export function Button(props: ButtonProps) {
	return (
		<button
			{...filterBykeys(props, ['LeftIcon', 'RightIcon', 'variant', 'label', 'size'])}
			className={cn(
				'inline-flex items-center justify-center gap-x-2 rounded-md font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
				buttonVariants[props.variant ?? 'primary'],
				buttonSizes[props.size ?? 'medium'],
				props.disabled ? `${buttonVariants['disabled']} cursor-not-allowed` : '',
				props.className
			)}
		>
			{props.LeftIcon ? props.LeftIcon : null}
			{props.label ? props.label : props.children}
			{props.RightIcon ? props.RightIcon : null}
		</button>
	);
}
