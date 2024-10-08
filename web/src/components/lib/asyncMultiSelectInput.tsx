'use client';

import { apiClient } from '@/api/config';
import { PingLoader } from '@/components/lib/loaders';
import { cn } from '@/utils/helpers';
import { getUniqueObjectsByKey } from '@/utils/helpers';
import { ApiResponse, DbRow, PaginationResponse } from '@/utils/types';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import ChevronUpDownIcon from '@heroicons/react/24/outline/ChevronUpDownIcon';
import { useQuery } from '@tanstack/react-query';
import { FC, Fragment, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type AsyncMultiSelectProps<T> = {
	valueKey: keyof T;
	labelKey: keyof T;
	queryKeys: string[];
	paginateUrl: string;
	workspaceId: string;
	pageSize?: number;
	default?: string[];
	name?: string;
	label?: string;
	value?: string[];
	className?: string;
	onChange?: (value: string[]) => void;
	optionRender?: FC<{ option: T; selected: boolean; focus: boolean }>;
	selectedRender?: FC<{ options: T[]; removeOption: (s: string) => void }>;

	errorText?: string;
	required?: boolean;
	labelClassName?: string;
	descriptionText?: string;
};

export function AsyncMultiSelect<T extends DbRow>(props: AsyncMultiSelectProps<T>) {
	const { t } = useTranslation();
	const optionsRef = useRef<T[]>([]);
	const hasNextPageRef = useRef<boolean>(true);

	const [page, setPage] = useState(1);
	const [selectedOptionsValues, setSelectedOptionsValues] = useState<string[]>(props.value || props.default || []);

	const selectedValuesOptions = useMemo(() => {
		const _options: T[] = [];
		for (let i = 0; i < optionsRef.current.length; i++) {
			if (selectedOptionsValues.includes(optionsRef.current[i][props.valueKey] as any)) _options.push(optionsRef.current[i]);
		}
		return _options;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedOptionsValues]);

	function onListboxChange(_selectedValues: string[]) {
		const values: string[] = Array.from(
			new Set((_selectedValues || []).map((t: any) => (typeof t === 'string' || typeof t === 'number' ? t : t[props.valueKey])))
		);
		return props.onChange ? props.onChange(values) : setSelectedOptionsValues(values);
	}

	function removeSelectedValue(value: string) {
		const values = selectedOptionsValues.filter((v) => v !== value);
		return props.onChange ? props.onChange(values) : setSelectedOptionsValues(values);
	}

	function loadMore() {
		if (hasNextPageRef.current) setPage((prev) => prev + 1);
	}

	const { isFetching } = useQuery({
		select: (res) => {
			optionsRef.current = getUniqueObjectsByKey([...optionsRef.current, ...(res?.data.docs || [])], props.valueKey as string);
			hasNextPageRef.current = res?.data.hasNextPage || false;
			return res;
		},
		queryKey: [...props.queryKeys, page, props.pageSize || 15, props.workspaceId],
		queryFn: () =>
			apiClient<ApiResponse<PaginationResponse<T>>>(
				`${props.paginateUrl}${props.paginateUrl.includes('?') ? '&' : '?'}page=${page}&limit=${props.pageSize || 15}`
			),
	});

	return (
		<Listbox multiple value={selectedOptionsValues} onChange={onListboxChange}>
			{({ open }) => (
				<div>
					<input type='hidden' name={props.name} value={JSON.stringify(selectedOptionsValues)} />
					{props.label ? (
						<label htmlFor={props.name} className={cn('block text-sm font-medium leading-6 text-gray-900', props.labelClassName)}>
							{props.label}&nbsp;
							<span className='text-red-500'>{props.required ? '*' : ''}</span>
						</label>
					) : null}

					{props.errorText ? <p className='mt-1 text-sm text-red-500'>{props.errorText}</p> : null}

					<div className='relative w-full'>
						<ListboxButton className='text-labelColor relative min-h-9 w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6'>
							<div className='flex flex-wrap gap-1'>
								{props.selectedRender ? (
									<props.selectedRender options={selectedValuesOptions} removeOption={removeSelectedValue} />
								) : (
									selectedValuesOptions.map((option) => (
										<div
											key={option[props.valueKey] as any}
											className='flex h-7 cursor-pointer select-none items-center justify-center rounded-lg border-2 border-borderColor bg-white py-1 pl-2 text-sm text-black'
										>
											{option[props.labelKey] as any}
											<span onClick={() => removeSelectedValue(option[props.valueKey] as any)} className='ml-2 rounded-r-lg bg-disabled px-2 text-xl'>
												&times;
											</span>
										</div>
									))
								)}
							</div>

							<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
								<ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
							</span>
						</ListboxButton>

						<Transition show={open} as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
							<ListboxOptions
								anchor='bottom'
								className='absolute z-20 mt-1 max-h-60 w-full overflow-hidden rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 hover:overflow-auto focus:outline-none sm:text-sm'
							>
								{optionsRef.current.map((option) => (
									<ListboxOption
										value={option}
										key={option[props.valueKey] as any}
										className={({ focus }) =>
											cn('relative cursor-default select-none py-2 pl-3 pr-9', focus ? 'bg-primary text-white' : 'text-gray-900')
										}
									>
										{({ focus }) => {
											const selected = selectedOptionsValues.includes(option[props.valueKey] as any);

											return (
												<Fragment>
													{props.optionRender ? (
														<props.optionRender {...{ option, selected, focus }} />
													) : (
														<div className='w-full'>{option[props.labelKey] as any}</div>
													)}

													{selected ? (
														<span className={cn('absolute inset-y-0 right-0 flex items-center pr-4', focus ? 'text-white' : 'text-primary')}>
															<CheckIcon className='h-5 w-5' aria-hidden='true' />
														</span>
													) : null}
												</Fragment>
											);
										}}
									</ListboxOption>
								))}

								{isFetching ? (
									<div className='flex h-10 items-center justify-center'>
										<PingLoader />
									</div>
								) : hasNextPageRef.current ? (
									<div
										onClick={loadMore}
										className='mt-1 flex h-8 w-full cursor-pointer items-center justify-center rounded-md bg-skeletonDark px-2 text-sm font-semibold hover:bg-skeletonLight'
									>
										{t('Load more')}
									</div>
								) : null}
							</ListboxOptions>
						</Transition>
					</div>

					{props.descriptionText ? <p className='mt-1 text-sm text-gray-500'>{props.descriptionText}</p> : null}
				</div>
			)}
		</Listbox>
	);
}
