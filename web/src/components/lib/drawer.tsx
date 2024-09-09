'use client';

import { cn } from '@/utils/helpers';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import XMarkIcon from '@heroicons/react/20/solid/XMarkIcon';
import { PropsWithChildren, ReactNode } from 'react';

export type DrawerProps = PropsWithChildren & {
	open: boolean;
	title?: ReactNode;
	setOpen: (val: boolean) => void;
	from: 'left' | 'right';
	className?: string;
};

export function Drawer(props: DrawerProps) {
	return (
		<Transition show={props.open}>
			<Dialog className='relative z-10' onClose={props.setOpen}>
				<TransitionChild
					enter='ease-in-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in-out duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</TransitionChild>

				<div className='fixed inset-0 z-10 overflow-hidden'>
					<div className={cn('pointer-events-none fixed inset-y-0 flex max-w-full', props.from === 'left' ? 'left-0' : 'right-0')}>
						<TransitionChild
							enter='transform transition ease-in-out duration-300'
							enterFrom={props.from === 'left' ? '-translate-x-full' : 'translate-x-full'}
							enterTo='translate-x-0'
							leave='transform transition ease-in-out duration-200'
							leaveFrom='translate-x-0'
							leaveTo={props.from === 'left' ? '-translate-x-full' : 'translate-x-full'}
						>
							<DialogPanel
								className={cn(
									'pointer-events-auto h-screen w-screen max-w-md overflow-hidden bg-white shadow-xl hover:overflow-auto',
									props.className
								)}
							>
								<div className='flex w-full items-center justify-between gap-4 border-b border-borderColor p-3'>
									{props.title ? (
										<DialogTitle as='h3' className='text-base font-semibold leading-6 text-gray-900'>
											{props.title}
										</DialogTitle>
									) : null}
									<XMarkIcon className='h-6 w-6 cursor-pointer hover:text-gray-600' onClick={() => props.setOpen(false)} />
								</div>

								{props.children}
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
