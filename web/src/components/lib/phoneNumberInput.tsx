import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

import TextInput from './textInput'
import SingleSelectInput, { Option } from './selectInput'

export type PhoneNumberInputProps = {
	label?: string
	icon?: FC<any>
	labelClassName?: string
	descriptionText?: string
	errorText?: string
	required?: boolean
}

const phoneNumberOptions: Array<Option> = [
	{ id: 1, value: '+91', label: 'IND' },
	{ id: 2, value: '+1', label: 'USA' },
]

function PhoneNumberInput(props: PhoneNumberInputProps) {
	return (
		<div>
			{props.label ? (
				<label htmlFor="phone" className={twMerge('block text-sm font-medium leading-6 text-labelColor', props.labelClassName)}>
					{props.label}&nbsp;
					<span className="text-red-500">{props.required ? '*' : ''}</span>
				</label>
			) : null}

			<div className="flex w-full items-center justify-stretch gap-2">
				<SingleSelectInput
					name="_ext"
					options={phoneNumberOptions}
					default={phoneNumberOptions[0]}
					render={({ active, option, selected }) => (
						<div className="flex">
							<span className={twMerge(selected ? 'font-semibold' : 'font-normal', 'truncate')}>{option.value}</span>
							<span className={twMerge(active ? 'text-indigo-200' : 'text-gray-500', 'ml-2 truncate')}>{option.label}</span>
						</div>
					)}
				/>
				<TextInput
					name="_phone"
					type="number"
					placeholder="XXXXXXXXXX"
					className="flex-1"
					errorText={props.errorText}
					labelClassName={props.labelClassName}
					descriptionText={props.descriptionText}
				/>
			</div>
		</div>
	)
}

export default PhoneNumberInput
