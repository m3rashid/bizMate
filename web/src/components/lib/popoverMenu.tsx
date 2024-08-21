import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { PropsWithChildren, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type PopoverMenuProps = PropsWithChildren<{
	trigger: ReactNode;
	position: 'left' | 'right' | 'center';
	popoverButtonClassName?: string;
	popoverPanelClassName?: string;
}>;

export function PopoverMenu(props: PopoverMenuProps) {
	return (
		<Popover className='relative'>
			<PopoverButton
				className={twMerge(
					'inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 outline-none',
					props.popoverButtonClassName
				)}
			>
				{props.trigger}
				<ChevronDownIcon aria-hidden='true' className='h-5 w-5' />
			</PopoverButton>

			<PopoverPanel
				transition
				className={twMerge(
					'absolute z-10 mt-1.5 flex transition data-[closed]:-translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in',
					props.position === 'left' && 'right-0',
					props.position === 'center' && 'left-1/2 -translate-x-1/2'
				)}
			>
				<div
					className={twMerge(
						'flex-auto overflow-hidden rounded-lg bg-white p-4 text-sm leading-6 shadow-lg ring-1 ring-primary ring-opacity-25',
						props.popoverPanelClassName
					)}
				>
					{props.children}
				</div>
			</PopoverPanel>
		</Popover>
	);
}
