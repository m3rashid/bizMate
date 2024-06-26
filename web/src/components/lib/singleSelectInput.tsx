import { twMerge } from 'tailwind-merge'
import { useState, Fragment, FC, useMemo } from 'react'
import CheckIcon from '@heroicons/react/20/solid/CheckIcon'
import ChevronUpDownIcon from '@heroicons/react/20/solid/ChevronUpDownIcon'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'

import { Option } from '../../types'
import { shuffleArray } from '../../utils/helpers'

export type SingleSelectInputProps = {
	default?: string
	options: Array<string | Option>
	name?: string
	label?: string
	value?: string
	className?: string
	onChange?: (value: string) => void
	render?: FC<{ option: Option; selected: boolean; focus: boolean }>
	shuffle?: boolean

	errorText?: string
	required?: boolean
	labelClassName?: string
	descriptionText?: string
}

function SingleSelectInput(props: SingleSelectInputProps) {
	const options: Option[] = useMemo(() => {
		if (props.options.length === 0) return [{ label: 'No options available', value: '' }]
		if (props.shuffle) shuffleArray(props.options)
		if (typeof props.options[0] === 'string' || typeof props.options[0] === 'number') {
			return props.options.map<Option>((op) => ({ label: op as string, value: op as string }))
		}
		return props.options as Option[]
	}, [props.options])

	const [selectedOptionValue, setSelectedOptionValue] = useState<string>(props.value || props.default || options[0]?.value || '')

	return (
		<Listbox
			name={props.name}
			value={selectedOptionValue}
			onChange={(val) =>
				props.onChange ? props.onChange((val as unknown as Option)?.value) : setSelectedOptionValue((val as unknown as Option).value)
			}
		>
			{({ open }) => (
				<div>
					{props.label ? (
						<label htmlFor={props.name} className={twMerge('block text-sm font-medium leading-6 text-gray-900', props.labelClassName)}>
							{props.label}&nbsp;
							<span className="text-red-500">{props.required ? '*' : ''}</span>
						</label>
					) : null}

					{props.errorText ? <p className="mt-1 text-sm text-red-500">{props.errorText}</p> : null}

					<div className="relative w-full">
						<ListboxButton className="text-labelColor relative min-h-9 w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6">
							{props.render ? (
								<props.render
									focus={false}
									selected={false}
									option={options.find((option) => option.value === (props.value ? props.value : selectedOptionValue))!}
								/>
							) : (
								<div className="w-full">{options.find((option) => option.value === selectedOptionValue)?.label || props.default}</div>
							)}

							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</ListboxButton>

						<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<ListboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{options.map((option) => (
									<ListboxOption
										key={option.value}
										value={option}
										className={({ focus }) =>
											twMerge('relative cursor-default select-none py-1 pl-3 pr-9', focus ? 'bg-primaryLight' : 'text-gray-900')
										}
									>
										{({ selected, focus }) => (
											<Fragment>
												{props.render ? <props.render {...{ option, selected, focus }} /> : <div className="w-full">{option.label}</div>}

												{selected ? (
													<span className={twMerge('absolute inset-y-0 right-0 flex items-center pr-4', focus ? 'text-white' : 'text-primaryLight')}>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</Fragment>
										)}
									</ListboxOption>
								))}
							</ListboxOptions>
						</Transition>
					</div>

					{props.descriptionText ? <p className="mt-1 text-sm text-gray-500">{props.descriptionText}</p> : null}
				</div>
			)}
		</Listbox>
	)
}

export default SingleSelectInput
