import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

export type ChipProps = PropsWithChildren & {
	className?: string
	size?: 'small' | 'medium' | 'large'
	variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'disabled'
}

const chipVariants = {
	primary: 'bg-primary',
	secondary: 'bg-secondary',
	success: 'bg-success',
	danger: 'bg-danger',
	disabled: 'bg-disabled',
} as const

const chipSizes = {
	small: 'px-2 py-1 text-xs',
	medium: 'px-3 py-1 text-sm',
	large: 'px-4 py-2 text-base',
} as const

function Chip(props: ChipProps) {
	return (
		<div
			className={twMerge(
				'select-none rounded-lg text-white',
				chipVariants[props.variant || 'primary'],
				chipSizes[props.size || 'medium'],
				props.className,
			)}
		>
			{props.children}
		</div>
	)
}

export default Chip
