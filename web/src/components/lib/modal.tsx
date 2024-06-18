import XMarkIcon from '@heroicons/react/20/solid/XMarkIcon'
import { Fragment, PropsWithChildren, ReactNode } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

export type ModalProps = PropsWithChildren & {
	open: boolean
	title?: ReactNode
	setOpen: (val: boolean) => void
}

function Modal(props: ModalProps) {
	return (
		<Transition show={props.open} as={Fragment}>
			<Dialog onClose={props.setOpen} className="relative z-10">
				<TransitionChild
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</TransitionChild>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
						<TransitionChild
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<DialogPanel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
								<div className="flex w-full items-center justify-between gap-4 p-4">
									{props.title ? (
										<DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
											{props.title}
										</DialogTitle>
									) : null}
									<XMarkIcon className="h-6 w-6 cursor-pointer hover:text-gray-600" onClick={() => props.setOpen(false)} />
								</div>
								{props.children}
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default Modal
