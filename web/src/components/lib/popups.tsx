'use client';

import { ActionPopupType, MessagePopupType, PopupType, usePopups } from '@/hooks/popups';
import { cn } from '@/utils/helpers';
import CheckCircleIcon from '@heroicons/react/20/solid/CheckCircleIcon';
import ExclamationTriangleIcon from '@heroicons/react/20/solid/ExclamationTriangleIcon';
import InformationCircleIcon from '@heroicons/react/20/solid/InformationCircleIcon';
import XCircleIcon from '@heroicons/react/20/solid/XCircleIcon';
import XMarkIcon from '@heroicons/react/20/solid/XMarkIcon';
import { createPortal } from 'react-dom';

export const popupVariants: Record<PopupType, string> = {
	error: 'bg-red-50 border-red-300',
	success: 'bg-green-50 border-green-300',
	info: 'bg-blue-50 border-blue-300',
	warning: 'bg-yellow-50 border-yellow-300',
};

export const PopupIcons: Record<PopupType, [any, string]> = {
	error: [XCircleIcon, 'text-red-400'],
	success: [CheckCircleIcon, 'text-green-400'],
	info: [InformationCircleIcon, 'text-blue-400'],
	warning: [ExclamationTriangleIcon, 'text-yellow-400'],
};

export function ActionPopup(props: ActionPopupType) {
	const [Icon, color] = PopupIcons[props.type];
	const { removeActionPopup } = usePopups();

	return (
		<div className={cn('w-full rounded-lg border-[1px] border-l-8 bg-white p-2 shadow-md', popupVariants[props.type], 'relative')}>
			<XMarkIcon
				className='absolute right-1 top-1 h-6 w-6 cursor-pointer rounded-full hover:bg-danger hover:text-white'
				onClick={() => removeActionPopup(props.id)}
			/>
			{props.title ? (
				<div className='flex gap-2 rounded-md'>
					<div>
						<Icon className={cn('h-5 w-5', color)} />
					</div>
					<div className='font-[500]'>{props.title}</div>
				</div>
			) : null}
			<div className='mt-2'>{props.children}</div>
		</div>
	);
}

export function MessagePopup(props: MessagePopupType) {
	const [Icon, color] = PopupIcons[props.type];

	return (
		<div className={cn('flex w-full gap-2 rounded-lg border-[1px] border-l-8 bg-white p-2 shadow-lg', popupVariants[props.type])}>
			<div>
				<Icon className={cn('h-5 w-5', color)} />
			</div>
			<div>{props.message}</div>
		</div>
	);
}

const popupContainerClassName = 'absolute top-0 z-[99] max-h-full w-full max-w-80 overflow-hidden flex flex-col gap-2 items-center';

export function MessagePopupContainer() {
	const { messagePopups } = usePopups();

	return createPortal(
		<div className={cn(popupContainerClassName, 'left-[calc(50vw-160px)]', messagePopups.length > 0 ? 'p-2' : '')}>
			{messagePopups.map((messagePopup) => (
				<MessagePopup key={messagePopup.id} {...messagePopup} />
			))}
		</div>,
		document.body
	);
}

export function ActionPopupContainer() {
	const { actionPopups } = usePopups();

	return createPortal(
		<div className={cn(popupContainerClassName, 'right-0', actionPopups.length > 0 ? 'p-2' : '')}>
			{actionPopups.map((actionPopup) => (
				<ActionPopup key={actionPopup.id} {...actionPopup} />
			))}
		</div>,
		document.body
	);
}
