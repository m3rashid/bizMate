import { twMerge } from 'tailwind-merge'
import { FC, ForwardedRef, forwardRef, useImperativeHandle, useReducer, useRef } from 'react'

import TextInput from './textInput'
import SingleSelectInput, { Option } from './selectInput'

export type PhoneNumberInputProps = {
	name: string
	label?: string
	icon?: FC<any>
	errorText?: string
	required?: boolean
	labelClassName?: string
	descriptionText?: string
}

const phoneExtOptions: Array<Option> = [
	{ id: 1, value: '+91', label: 'IND' },
	{ id: 2, value: '+1', label: 'USA' },
]

function getPhoneNumber(phone: string, ext: string) {
	return ext + ' ' + phone
}

const initialState = { phoneNumber: '', phoneExt: phoneExtOptions[0].value, phone: getPhoneNumber('', phoneExtOptions[0].value) }

type Action = { type: 'CHANGE_EXT'; ext: string } | { type: 'CHANGE_PHONE'; phone: string } | { type: 'CLEAR' }
type State = typeof initialState
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

function Component(
	props: PhoneNumberInputProps,
	ref: ForwardedRef<{
		getValue: () => string
		clear: () => void
		setValue: (value: string) => void
	}>,
) {
	const inputRef = useRef(null)
	const [{ phone, phoneExt, phoneNumber }, dispatch] = useReducer(phoneNumberReducer, initialState)

	useImperativeHandle(ref, () => ({
		getValue: () => phone,
		clear: () => dispatch({ type: 'CLEAR' }),
		setValue: (value: string) => {
			console.log({ value })
		},
	}))

	return (
		<div>
			<input type="hidden" name={props.name} ref={inputRef} value={phone} />
			{props.label ? (
				<label htmlFor="phone" className={twMerge('block text-sm font-medium leading-6 text-labelColor', props.labelClassName)}>
					{props.label}&nbsp;
					<span className="text-red-500">{props.required ? '*' : ''}</span>
				</label>
			) : null}

			<div className="flex w-full items-center justify-stretch gap-2">
				<SingleSelectInput
					value={phoneExt}
					options={phoneExtOptions}
					default={phoneExtOptions[0]}
					onChange={(value) => dispatch({ type: 'CHANGE_EXT', ext: value })}
					render={({ active, option, selected }) => (
						<div className="flex">
							<span className={twMerge(selected ? 'font-semibold' : 'font-normal', 'truncate')}>{option.value}</span>
							<span className={twMerge(active ? 'text-indigo-200' : 'text-gray-500', 'ml-2 truncate')}>{option.label}</span>
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
