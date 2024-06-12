import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

export type ChipProps = PropsWithChildren & {
	className?: string
	size?: 'small' | 'medium' | 'large'
	variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'disabled' | 'simple'
}

const chipVariants = {
	primary: 'bg-primary',
	secondary: 'bg-secondary',
	success: 'bg-success',
	danger: 'bg-danger',
	disabled: 'bg-disabled',
	simple: 'bg-white text-black border-2 border-borderColor',
} as const

const chipSizes = {
	small: 'px-2 py-1 h-6 text-xs',
	medium: 'px-3 py-1 h-7 text-sm',
	large: 'px-4 py-2 h-8 text-base',
} as const

function Chip(props: ChipProps) {
	return (
		<div
			className={twMerge(
				'flex select-none items-center justify-center rounded-lg text-white',
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
