import { cn } from '@/utils/helpers';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import XMarkIcon from '@heroicons/react/20/solid/XMarkIcon';
import { Fragment, PropsWithChildren, ReactNode } from 'react';

export type ModalProps = PropsWithChildren & {
	open: boolean;
	title?: ReactNode;
	setOpen: (val: boolean) => void;
	className?: string;
	titleClassName?: string;
};

export function Modal(props: ModalProps) {
	return (
		<Transition show={props.open} as={Fragment}>
			<Dialog onClose={props.setOpen} className='relative z-10'>
				<TransitionChild
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0 scale-50'
					enterTo='opacity-100 scale-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</TransitionChild>

				<div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'>
						<TransitionChild
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 scale-50'
							enterTo='opacity-100 translate-y-0 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 scale-0'
						>
							<DialogPanel
								className={cn(
									'relative w-full transform rounded-lg bg-white text-left shadow-md transition-all sm:my-8 sm:max-w-xl md:max-w-3xl',
									props.className
								)}
							>
								{props.title ? (
									<div className='flex w-full items-center justify-between gap-4 border-b border-borderColor p-3'>
										<DialogTitle as='h3' className={cn('text-base font-semibold leading-6 text-gray-900', props.titleClassName)}>
											{props.title}
										</DialogTitle>
										<XMarkIcon className='h-6 w-6 cursor-pointer hover:text-gray-600' onClick={() => props.setOpen(false)} />
									</div>
								) : null}
								{props.children}
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
