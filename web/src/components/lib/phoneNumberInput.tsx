import { FC, useReducer } from 'react'
import { twMerge } from 'tailwind-merge'

import Input from './input'
import { Option } from '../../types'
import SingleSelectInput from './singleSelectInput'

export type PhoneNumberInputProps = {
	name: string
	label?: string
	icon?: FC<any>
	errorText?: string
	required?: boolean
	defaultValue?: string
	labelClassName?: string
	descriptionText?: string
}

const phoneOptions: Option[] = [
	{ value: '+91', label: 'IND' },
	{ value: '+1', label: 'USA' },
]

function getPhoneNumber(phone: string, ext: string) {
	return ext + ' ' + phone
}

const initialState = {
	phoneNumber: '',
	phoneExt: phoneOptions[0].value,
	phone: getPhoneNumber('', phoneOptions[0].value),
}
type State = typeof initialState

type Action = { type: 'CHANGE_EXT'; ext: string } | { type: 'CHANGE_PHONE'; phone: string } | { type: 'CLEAR' }

function phoneNumberReducer(state: State, action: Action): State {
	if (action.type === 'CLEAR') return initialState
	if (action.type === 'CHANGE_EXT') {
		return { ...state, phoneExt: action.ext, phone: getPhoneNumber(state.phoneNumber, action.ext) }
	}

	if (action.type === 'CHANGE_PHONE') {
		return { ...state, phoneNumber: action.phone, phone: getPhoneNumber(action.phone, state.phoneExt) }
	}

	return state
}

function getDefaultValue(props: PhoneNumberInputProps): State {
	if (!props.defaultValue) return initialState
	const [ext, phoneNumber] = props.defaultValue.split(' ')
	const _phoneExt = phoneOptions.find((op) => op.value === ext)
	const phoneExt = _phoneExt ? _phoneExt.value : initialState.phoneExt
	return { ...initialState, phoneNumber, phoneExt, phone: getPhoneNumber(phoneNumber, phoneExt) }
}

function PhoneNumberInput(props: PhoneNumberInputProps) {
	const [{ phone, phoneExt, phoneNumber }, dispatch] = useReducer(phoneNumberReducer, getDefaultValue(props))

	return (
		<div>
			<input type="hidden" name={props.name} required={props.required} value={phone} />
			{props.label ? (
				<label htmlFor="phone" className={twMerge('text-labelColor block text-sm font-medium leading-6', props.labelClassName)}>
					{props.label}&nbsp;
					<span className="text-red-500">{props.required ? '*' : ''}</span>
				</label>
			) : null}

			<div className="flex w-full items-center justify-stretch gap-2">
				<SingleSelectInput
					value={phoneExt}
					options={phoneOptions}
					onChange={(value) => dispatch({ type: 'CHANGE_EXT', ext: value })}
					render={({ focus, option, selected }) => (
						<div className="flex">
							<span className={twMerge('min-w-7 truncate', selected ? 'font-semibold' : 'font-normal')}>{option.value}</span>
							<span className={twMerge('ml-2 truncate', focus ? 'text-indigo-200' : 'text-gray-500')}>
								{phoneOptions.find((op) => op.value === option.value)?.label || phoneOptions[0].label}
							</span>
						</div>
					)}
				/>

				<Input
					type="number"
					className="flex-1"
					value={phoneNumber}
					placeholder="XXXXXXXXXX"
					required={props.required}
					errorText={props.errorText}
					labelClassName={props.labelClassName}
					descriptionText={props.descriptionText}
					onChange={(e) => dispatch({ type: 'CHANGE_PHONE', phone: e.target.value })}
				/>
			</div>
		</div>
	)
}

export default PhoneNumberInput
