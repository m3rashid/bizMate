'use client';

import { cn } from '@/utils/helpers';
import { shuffleArray } from '@/utils/helpers';
import { Option } from '@/utils/types';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import CheckIcon from '@heroicons/react/20/solid/CheckIcon';
import ChevronUpDownIcon from '@heroicons/react/20/solid/ChevronUpDownIcon';
import { useState, Fragment, FC, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type SingleSelectInputProps = {
	default?: string;
	options: Array<string | Option>;
	name?: string;
	label?: string;
	value?: string;
	className?: string;
	onChange?: (value: string) => void;
	render?: FC<{ option: Option; selected: boolean; focus: boolean }>;
	shuffle?: boolean;

	errorText?: string;
	required?: boolean;
	labelClassName?: string;
	descriptionText?: string;
	buttonClassName?: string;
	noIcon?: boolean;
};

export function SingleSelectInput(props: SingleSelectInputProps) {
	const { t } = useTranslation();

	const options: Option[] = useMemo(() => {
		if (props.options.length === 0) return [{ label: t('No options available'), value: '' }];

		let newOptions = props.options;
		if (props.shuffle) newOptions = shuffleArray(props.options);
		if (typeof newOptions[0] === 'string' || typeof newOptions[0] === 'number') {
			return newOptions.map<Option>((op) => ({ label: op as string, value: op as string }));
		}
		return newOptions as Option[];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.options]);

	const [selectedOptionValue, setSelectedOptionValue] = useState<string>(props.value || props.default || options[0]?.value || '');

	useEffect(() => {
		setSelectedOptionValue(options.find((option) => option.value === props.value)?.value || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.value]);

	return (
		<Listbox
			name={props.name}
			value={selectedOptionValue}
			onChange={(val) => {
				setSelectedOptionValue((val as unknown as Option).value);
				if (props.onChange) props.onChange((val as unknown as Option)?.value);
			}}
		>
			{({ open }) => (
				<div className={props.className}>
					{props.label ? (
						<label htmlFor={props.name} className={cn('block text-sm font-medium leading-6 text-gray-900', props.labelClassName)}>
							{props.label}&nbsp;
							<span className='text-red-500'>{props.required ? '*' : ''}</span>
						</label>
					) : null}

					{props.errorText ? <p className='mt-1 text-sm text-red-500'>{props.errorText}</p> : null}

					<div className='relative w-full'>
						<ListboxButton
							className={cn(
								'text-labelColor relative min-h-9 w-full cursor-default rounded-md bg-white py-1.5 pl-3 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6',
								!props.noIcon ? 'pr-10' : 'pr-3',
								props.buttonClassName
							)}
						>
							{props.render ? (
								<props.render
									focus={false}
									selected={false}
									option={options.find((option) => option.value === (props.value ? props.value : selectedOptionValue))!}
								/>
							) : (
								<div className='w-full'>{options.find((option) => option.value === selectedOptionValue)?.label || props.default}</div>
							)}

							{!props.noIcon ? (
								<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
									<ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</span>
							) : null}
						</ListboxButton>

						<Transition show={open} as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
							<ListboxOptions className='absolute z-20 mt-1 max-h-60 w-full min-w-[100px] overflow-hidden rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 hover:overflow-auto focus:outline-none sm:text-sm'>
								{options.map((option) => (
									<ListboxOption
										key={option.value}
										value={option}
										className={({ focus }) => cn('relative cursor-default select-none py-1 pl-3 pr-9', focus ? 'bg-primaryLight' : 'text-gray-900')}
									>
										{({ selected, focus }) => (
											<Fragment>
												{props.render ? <props.render {...{ option, selected, focus }} /> : <div className='w-full'>{option.label}</div>}

												{selected ? (
													<span className={cn('absolute inset-y-0 right-0 flex items-center pr-4', focus ? 'text-white' : 'text-primaryLight')}>
														<CheckIcon className='h-5 w-5' aria-hidden='true' />
													</span>
												) : null}
											</Fragment>
										)}
									</ListboxOption>
								))}
							</ListboxOptions>
						</Transition>
					</div>

					{props.descriptionText ? <p className='mt-1 text-sm text-gray-500'>{props.descriptionText}</p> : null}
				</div>
			)}
		</Listbox>
	);
}
