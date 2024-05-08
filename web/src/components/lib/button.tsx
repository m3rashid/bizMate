import { ButtonHTMLAttributes, FC } from 'react'
import { twMerge } from 'tailwind-merge'

const buttonVariants = {
	primary: 'bg-primary hover:bg-primary focus-visible:outline-primary',
	danger: 'bg-danger hover:bg-danger focus-visible:outline-danger',
	secondary: 'bg-secondary hover:bg-secondary focus-visible:outline-secondary',
	disabled: 'bg-disabled hover:bg-disabled focus-visible:outline-disabled',
	sucess: 'bg-sucess hover:bg-sucess focus-visible:outline-sucess',
	simple:
		'bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-gray-200 border border-gray-300',
} as const

const buttonSizes = {
	small: 'px-3 py-1.5 text-sm',
	medium: 'px-5 py-2 text-base',
	large: 'px-7 py-2 text-base',
} as const

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	leftIcon?: FC<any>
	rightIcon?: FC<any>
	variant?: keyof typeof buttonVariants
	label?: string
	size?: keyof typeof buttonSizes
}

function Button(props: ButtonProps) {
	return (
		<button
			onClick={props.onClick}
			className={twMerge(
				'inline-flex items-center justify-center gap-x-2 rounded-md font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
				buttonVariants[props.variant ?? 'primary'],
				buttonSizes[props.size ?? 'medium'],
				props.className,
			)}
			{...props}
		>
			{props.leftIcon ? <props.leftIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" /> : null}
			{props.label || props.children}
			{props.rightIcon ? <props.rightIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" /> : null}
		</button>
	)
}

export default Button
