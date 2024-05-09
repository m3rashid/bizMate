import { ChangeEvent, FC, TextareaHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import { filterBykeys } from '../../utils/helpers'

export type TextAreaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string
	icon?: FC<any>
	errorText?: string
	labelClassName?: string
	descriptionText?: string
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

function TextAreaInput(props: TextAreaInputProps) {
	return (
		<div className="w-full">
			{props.label ? (
				<label
					htmlFor={props.name}
					className={twMerge(
						'block text-sm font-medium leading-6 text-gray-900',
						props.labelClassName,
					)}
				>
					{props.label}&nbsp;
					<span className="text-red-500">{props.required ? '*' : ''}</span>
				</label>
			) : null}

			{props.errorText ? <p className="mt-1 text-sm text-red-500">{props.errorText}</p> : null}

			<div className="relative rounded-md shadow-sm">
				{props.icon ? (
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<props.icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
					</div>
				) : null}

				<textarea
					{...filterBykeys(props, [
						'label',
						'icon',
						'errorText',
						'labelClassName',
						'descriptionText',
					])}
					id={props.name}
					className={twMerge(
						'block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
						!props.icon ? 'pl-3' : 'pl-10',
						props.errorText
							? 'text-red-500 ring-1 ring-inset ring-red-300 placeholder:text-red-300'
							: '',
						props.className,
					)}
				/>
			</div>

			{props.descriptionText ? (
				<p className="mt-1 text-sm text-gray-500">{props.descriptionText}</p>
			) : null}
		</div>
	)
}

export default TextAreaInput
