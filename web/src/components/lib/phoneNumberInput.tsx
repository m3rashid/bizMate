import { twMerge } from 'tailwind-merge'
import { FC, ForwardedRef, forwardRef, useImperativeHandle, useReducer, useRef } from 'react'

import TextInput from './textInput'
import SingleSelectInput, { Option } from './singleSelectInput'

export type PhoneNumberInputProps = {
	name: string
	label?: string
	icon?: FC<any>
	errorText?: string
	required?: boolean
	labelClassName?: string
	descriptionText?: string
}

const phoneOptions: Array<Option> = [
	{ id: 1, value: '+91', label: 'IND' },
	{ id: 2, value: '+1', label: 'USA' },
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

function Component(props: PhoneNumberInputProps, ref: ForwardedRef<{ getValue: () => string; clear: () => void }>) {
	const inputRef = useRef(null)
	const [{ phone, phoneExt, phoneNumber }, dispatch] = useReducer(phoneNumberReducer, initialState)

	useImperativeHandle(ref, () => ({
		getValue: () => phone,
		clear: () => dispatch({ type: 'CLEAR' }),
	}))

	return (
		<div>
			<input type="hidden" name={props.name} ref={inputRef} value={phone} />
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
					default={phoneOptions[0].value}
					onChange={(value) => dispatch({ type: 'CHANGE_EXT', ext: value })}
					render={({ active, option, selected }) => (
						<div className="flex">
							<span className={twMerge(selected ? 'font-semibold' : 'font-normal', 'min-w-7 truncate')}>{option}</span>
							<span className={twMerge(active ? 'text-indigo-200' : 'text-gray-500', 'ml-2 truncate')}>
								{phoneOptions.find((op) => op.value === option)?.label || phoneOptions[0].label}
							</span>
						</div>
					)}
				/>

				<TextInput
					type="number"
					className="flex-1"
					value={phoneNumber}
					placeholder="XXXXXXXXXX"
					errorText={props.errorText}
					labelClassName={props.labelClassName}
					descriptionText={props.descriptionText}
					onChange={(e) => dispatch({ type: 'CHANGE_PHONE', phone: e.target.value })}
				/>
			</div>
		</div>
	)
}

const PhoneNumberInput = forwardRef(Component)
export default PhoneNumberInput
