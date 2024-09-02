import { cn } from '@/utils/helpers';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export const buttonVariants = {
	primary: 'bg-primary hover:bg-primary focus-visible:outline-primary',
	danger: 'bg-danger hover:bg-danger focus-visible:outline-danger',
	secondary: 'bg-secondary hover:bg-secondary focus-visible:outline-secondary',
	disabled: 'bg-disabled hover:bg-disabled focus-visible:outline-disabled',
	sucess: 'bg-success hover:bg-success focus-visible:outline-success',
	simple: 'bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-gray-200 border border-gray-300',
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export const buttonSizes = {
	small: 'px-3 py-1.5 text-sm',
	medium: 'px-5 py-2 text-base',
	large: 'px-7 py-2 text-base',
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	LeftIcon?: ReactNode;
	RightIcon?: ReactNode;
	variant?: ButtonVariant;
	label?: string;
	size?: ButtonSize;
};

export function Button({ LeftIcon, RightIcon, variant, label, size, ...props }: ButtonProps) {
	return (
		<button
			{...props}
			className={cn(
				'inline-flex items-center justify-center gap-x-2 rounded-md font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
				buttonVariants[variant ?? 'primary'],
				buttonSizes[size ?? 'medium'],
				props.disabled ? `${buttonVariants['disabled']} cursor-not-allowed` : '',
				props.className
			)}
		>
			{LeftIcon ? LeftIcon : null}
			{label ? label : props.children}
			{RightIcon ? RightIcon : null}
		</button>
	);
}
