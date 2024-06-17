import { twMerge } from 'tailwind-merge'
import { InputHTMLAttributes, useMemo } from 'react'
import { Radio, RadioGroup } from '@headlessui/react'
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon'

import { Option } from '../../types'
import { shuffleArray } from '../../utils/helpers'

export type SimpleRadioProps = InputHTMLAttributes<HTMLInputElement> & {
	options: Array<string | Option>
	label?: string
	shuffle?: boolean
	errorText?: string
	labelClassName?: string
	descriptionText?: string
	radioGroupClassName?: string
	onChange?: (val: string) => void
	radioClassname?: (props: { focus: boolean }) => string
}

function RadioInput(props: SimpleRadioProps) {
	const options = useMemo(() => {
		if (props.options.length === 0) return [{ label: 'No options available', value: '' }]
		if (props.shuffle) shuffleArray(props.options)
		if (typeof props.options[0] === 'string' || typeof props.options[0] === 'number') {
			return props.options.map<Option>((op) => ({ label: op as string, value: op as string }))
		}
		return props.options as Option[]
	}, [props.options])

	return (
		<fieldset className="w-full">
			{props.label ? (
				<label htmlFor={props.name} className={twMerge('block text-sm font-medium leading-6 text-gray-900', props.labelClassName)}>
					{props.label}&nbsp;
					<span className="text-red-500">{props.required ? '*' : ''}</span>
				</label>
			) : null}
			{props.descriptionText ? <p className="mt-1 text-sm text-gray-500">{props.descriptionText}</p> : null}
			{props.errorText ? <p className="mt-1 text-sm text-red-500">{props.errorText}</p> : null}

			<RadioGroup
				name={props.name}
				className={twMerge(
					'block w-full rounded-md py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
					props.radioGroupClassName,
				)}
				{...(props.value ? { value: props.value, onChange: props.onChange ? props.onChange : () => {} } : {})}
			>
				{options.map((option) => (
					<Radio
						key={option.value}
						value={option.value}
						defaultChecked={option.value === props.defaultValue}
						className={({ focus }) =>
							twMerge('relative flex cursor-pointer bg-white p-[2px] shadow-sm', props.radioClassname ? props.radioClassname({ focus }) : '')
						}
					>
						{({ checked }) => (
							<div className="flex w-full gap-2">
								{checked ? (
									<CheckCircleIcon className="h-5 w-5 text-primary" />
								) : (
									<div className="h-5 w-5 rounded-full border-2 border-primaryLight" />
								)}
								{option.label}
							</div>
						)}
					</Radio>
				))}
			</RadioGroup>
		</fieldset>
	)
}

export default RadioInput
