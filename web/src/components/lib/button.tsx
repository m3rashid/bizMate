import { ButtonHTMLAttributes, FC } from 'react'
import { twMerge } from 'tailwind-merge'

const buttonVariants = {
	primary: 'bg-primary hover:bg-primary focus-visible:outline-primary',
	danger: 'bg-danger hover:bg-danger focus-visible:outline-danger',
	secondary: 'bg-secondary hover:bg-secondary focus-visible:outline-secondary',
	disabled: 'bg-disabled hover:bg-disabled focus-visible:outline-disabled',
	sucess: 'bg-sucess hover:bg-sucess focus-visible:outline-sucess',
} as const

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	leftIcon?: FC<any>
	rightIcon?: FC<any>
	variant?: keyof typeof buttonVariants
}

function Button(props: ButtonProps) {
	return (
		<button
			onClick={props.onClick}
			className={twMerge(
				'inline-flex items-center justify-center gap-x-2 rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
				buttonVariants[props.variant ?? 'primary'],
				props.className,
			)}
		>
			{props.leftIcon ? <props.leftIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" /> : null}
			{props.children}
			{props.rightIcon ? <props.rightIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" /> : null}
		</button>
	)
}

export default Button
