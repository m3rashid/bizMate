import { twMerge } from 'tailwind-merge'
import {
	Label,
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Transition,
} from '@headlessui/react'
import CheckIcon from '@heroicons/react/20/solid/CheckIcon'
import { ReactNode, useState, Fragment, FC, Key } from 'react'
import ChevronUpDownIcon from '@heroicons/react/20/solid/ChevronUpDownIcon'

export type Option = {
	label: ReactNode
	value: string
	id: Key
}

export type SelectInputProps = {
	default: string
	options: Array<Option>
	name?: string
	render: FC<{ option: string; selected: boolean; active: boolean }>
	label?: string
	value?: string
	className?: string
	onChange?: (value: string) => void
}

function SingleSelectInput(props: SelectInputProps) {
	const [selectedOptionValue, setSelectedOptionValue] = useState<string>(
		props.value || props.default,
	)

	return (
		<Listbox
			name={props.name}
			value={selectedOptionValue}
			onChange={(val) =>
				props.onChange
					? props.onChange((val as unknown as Option).value)
					: setSelectedOptionValue((val as unknown as Option).value)
			}
		>
			{({ open }) => (
				<Fragment>
					{props.label ? (
						<Label className="block text-sm font-medium leading-6 text-labelColor">
							{props.label}
						</Label>
					) : null}

					<div className="relative w-full">
						<ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-labelColor shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6">
							<props.render
								active={false}
								selected={false}
								option={
									props.options.find(
										(option) => option.value === (props.value ? props.value : selectedOptionValue),
									)?.value || props.default
								}
							/>

							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</ListboxButton>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{props.options.map((option) => (
									<ListboxOption
										key={option.id}
										value={option}
										className={({ active }) =>
											twMerge(
												'relative cursor-default select-none py-2 pl-3 pr-9',
												active ? 'bg-primary text-white' : 'text-gray-900',
											)
										}
									>
										{({ selected, active }) => (
											<Fragment>
												<props.render {...{ option: option.value, selected, active }} />
												{selected ? (
													<span
														className={twMerge(
															'absolute inset-y-0 right-0 flex items-center pr-4',
															active ? 'text-white' : 'text-primary',
														)}
													>
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
				</Fragment>
			)}
		</Listbox>
	)
}

export default SingleSelectInput
