import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'
import XCircleIcon from '@heroicons/react/20/solid/XCircleIcon'
import CheckCircleIcon from '@heroicons/react/20/solid/CheckCircleIcon'
import InformationCircleIcon from '@heroicons/react/20/solid/InformationCircleIcon'
import ExclamationTriangleIcon from '@heroicons/react/20/solid/ExclamationTriangleIcon'

import { ActionPopupType, MessagePopupType, PopupType, usePopups } from '../../hooks/popups'

export const popupVariants: Record<PopupType, string> = {
	error: 'bg-red-50 border-red-200',
	success: 'bg-green-50 border-green-200',
	info: 'bg-blue-50 border-blue-200',
	warning: 'bg-yellow-50 border-yellow-200',
}

export const PopupIcons: Record<PopupType, [any, string]> = {
	error: [XCircleIcon, 'text-red-300'],
	success: [CheckCircleIcon, 'text-green-300'],
	info: [InformationCircleIcon, 'text-blue-300'],
	warning: [ExclamationTriangleIcon, 'text-yellow-300'],
}

export function ActionPopup(props: ActionPopupType) {
	const [Icon, color] = PopupIcons[props.type]
	return (
		<div className={twMerge('w-full rounded-lg border-l-4 bg-white p-2 shadow-md', popupVariants[props.type])}>
			{props.title ? (
				<div className="flex gap-2">
					<div>
						<Icon className={twMerge('h-5 w-5', color)} />
					</div>

					<div>{props.title}</div>
				</div>
			) : (
				props.children
			)}
		</div>
	)
}

export function MessagePopup(props: MessagePopupType) {
	const [Icon, color] = PopupIcons[props.type]

	return (
		<div className={twMerge('flex w-full gap-2 rounded-lg border-l-4 bg-white p-2 shadow-md', popupVariants[props.type])}>
			<div>
				<Icon className={twMerge('h-5 w-5', color)} />
			</div>

			<div>{props.message}</div>
		</div>
	)
}

const popupContainerClassName = 'absolute top-0 z-[99] max-h-full w-full max-w-80 overflow-hidden flex flex-col gap-2 items-center'

export function MessagePopupContainer() {
	const { messagePopups } = usePopups()

	return createPortal(
		<div className={twMerge(popupContainerClassName, 'left-[calc(50vw-160px)]', messagePopups.length > 0 ? 'p-2' : '')}>
			{messagePopups.map((messagePopup) => (
				<MessagePopup key={messagePopup.id} {...messagePopup} />
			))}
		</div>,
		document.body,
	)
}

export function ActionPopupContainer() {
	const { actionPopups } = usePopups()

	return createPortal(
		<div className={twMerge(popupContainerClassName, 'right-0', actionPopups.length > 0 ? 'p-2' : '')}>
			{actionPopups.map((actionPopup) => (
				<ActionPopup key={actionPopup.id} {...actionPopup} />
			))}
		</div>,
		document.body,
	)
}
