import { twMerge } from 'tailwind-merge'
import { Listbox, Transition } from '@headlessui/react'
import CheckIcon from '@heroicons/react/20/solid/CheckIcon'
import { ReactNode, useState, Fragment, FC, Key } from 'react'
import ChevronUpDownIcon from '@heroicons/react/20/solid/ChevronUpDownIcon'

export type Option = {
	label: ReactNode
	value: string
	id: Key
}

export type SelectInputProps = {
	options: Array<Option>
	label?: string
	render: FC<{ option: Option; selected: boolean; active: boolean }>
	name?: string
	default: Option
}

function SingleSelectInput(props: SelectInputProps) {
	const [selectedOptionValue, setSelectedOptionValue] = useState<string>(props.default.value)

	return (
		<Listbox name={props.name} value={selectedOptionValue} onChange={setSelectedOptionValue}>
			{({ open }) => (
				<>
					{props.label ? <Listbox.Label className="text-labelColor block text-sm font-medium leading-6">{props.label}</Listbox.Label> : null}
					<div className="relative">
						<Listbox.Button className="text-labelColor relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6">
							<props.render
								option={props.options.find((option) => option.value === selectedOptionValue) || props.default}
								active={false}
								selected={false}
							/>

							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>

						<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{props.options.map((option) => (
									<Listbox.Option
										key={option.id}
										value={option}
										className={({ active }) =>
											twMerge('relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-primary text-white' : 'text-gray-900')
										}
									>
										{({ selected, active }) => (
											<>
												<props.render {...{ option, selected, active }} />
												{selected ? (
													<span className={twMerge('absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-primary')}>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	)
}

export default SingleSelectInput
