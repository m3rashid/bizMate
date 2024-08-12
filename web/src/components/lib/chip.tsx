import { cn } from '@/utils/helpers';
import { PropsWithChildren } from 'react';

const chipVariants = {
	primary: 'bg-primary',
	secondary: 'bg-secondary',
	success: 'bg-success',
	danger: 'bg-danger',
	disabled: 'bg-disabled',
	simple: 'bg-white text-black border-2 border-borderColor',
} as const;

const chipSizes = {
	small: 'px-2 py-1 h-6 text-xs',
	medium: 'px-3 py-1 h-7 text-sm',
	large: 'px-4 py-2 h-8 text-base',
} as const;

export type ChipProps = PropsWithChildren & {
	className?: string;
	size?: keyof typeof chipSizes;
	variant?: keyof typeof chipVariants;
};

export function Chip(props: ChipProps) {
	return (
		<div
			className={cn(
				'flex select-none items-center justify-center rounded-lg text-white',
				chipVariants[props.variant || 'primary'],
				chipSizes[props.size || 'medium'],
				props.className
			)}
		>
			{props.children}
		</div>
	);
}
