import apiClient from '@api/client'
import { Loader } from '@components/lib/loader'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'
import CheckIcon from '@heroicons/react/20/solid/CheckIcon'
import ChevronUpDownIcon from '@heroicons/react/20/solid/ChevronUpDownIcon'
import { DbRow, PaginationResponse } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { getUniqueObjectsByKey } from '@utils/helpers'
import { FC, Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

export type AsyncSingleSelectProps<T> = {
	valueKey: keyof T
	labelKey: keyof T
	queryKeys: string[]
	paginateUrl: string
	pageSize?: number
	workspaceId: string

	default?: string
	name?: string
	label?: string
	value?: string
	className?: string
	onChange?: (value: string) => void
	render?: FC<{ option: T; selected: boolean; focus: boolean }>

	errorText?: string
	required?: boolean
	labelClassName?: string
	descriptionText?: string
}

function AsyncSingleSelect<T extends DbRow>(props: AsyncSingleSelectProps<T>) {
	const { t } = useTranslation()
	const optionsRef = useRef<T[]>([])
	const hasNextPageRef = useRef<boolean>(true)

	const [page, setPage] = useState(1)
	const [selectedOptionValue, setSelectedOptionValue] = useState<string>(props.value || props.default || '')

	function loadMore() {
		if (hasNextPageRef.current) setPage((prev) => prev + 1)
	}

	const { isFetching } = useQuery<PaginationResponse<T>>({
		select: (data) => {
			optionsRef.current = getUniqueObjectsByKey([...optionsRef.current, ...data.docs], props.valueKey as string)
			hasNextPageRef.current = data.hasNextPage
			return data
		},
		queryKey: [...props.queryKeys, page, props.pageSize || 15, props.workspaceId],
		queryFn: () => apiClient(`${props.paginateUrl}${props.paginateUrl.includes('?') ? '&' : '?'}page=${page}&limit=${props.pageSize || 15}`),
	})

	return (
		<Listbox
			name={props.name}
			value={selectedOptionValue}
			onChange={(val) => {
				const _value = typeof val === 'string' ? val : (val as any)[props.valueKey]
				return props.onChange ? props.onChange(_value) : setSelectedOptionValue(_value)
			}}
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
									option={optionsRef.current.find((option) => option[props.valueKey] === (props.value ? props.value : selectedOptionValue))!}
								/>
							) : (
								<div className="w-full">
									{optionsRef.current.find((option) => option[props.valueKey] === (props.value ? props.value : selectedOptionValue))?.[
										props.labelKey
									] || ('' as any)}
								</div>
							)}

							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</ListboxButton>

						<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
							<ListboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{optionsRef.current.map((option) => (
									<ListboxOption
										key={option[props.valueKey] as string}
										value={option}
										className={({ focus }) =>
											twMerge('relative cursor-default select-none py-2 pl-3 pr-9', focus ? 'bg-primary text-white' : 'text-gray-900')
										}
									>
										{({ selected, focus }) => (
											<Fragment>
												{props.render ? (
													<props.render {...{ option, selected, focus }} />
												) : (
													<div className="w-full">{option[props.labelKey] as string}</div>
												)}

												{selected ? (
													<span className={twMerge('absolute inset-y-0 right-0 flex items-center pr-4', focus ? 'text-white' : 'text-primaryLight')}>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</Fragment>
										)}
									</ListboxOption>
								))}

								{isFetching ? (
									<div className="flex h-10 items-center justify-center">
										<Loader />
									</div>
								) : hasNextPageRef.current ? (
									<div
										onClick={loadMore}
										className="mt-1 flex h-8 w-full cursor-pointer items-center justify-center rounded-md bg-skeletonDark px-2 text-sm font-semibold hover:bg-skeletonLight"
									>
										{t('Load more')}
									</div>
								) : null}
							</ListboxOptions>
						</Transition>
					</div>

					{props.descriptionText ? <p className="mt-1 text-sm text-gray-500">{props.descriptionText}</p> : null}
				</div>
			)}
		</Listbox>
	)
}

export default AsyncSingleSelect
