'use client';

import { Button } from '@/components/lib/button';
import { ActionPopupType, PopupType, usePopups } from '@/hooks/popups';
import { cn } from '@/utils/helpers';
import CheckCircleIcon from '@heroicons/react/20/solid/CheckCircleIcon';
import ExclamationTriangleIcon from '@heroicons/react/20/solid/ExclamationTriangleIcon';
import InformationCircleIcon from '@heroicons/react/20/solid/InformationCircleIcon';
import XCircleIcon from '@heroicons/react/20/solid/XCircleIcon';
import XMarkIcon from '@heroicons/react/20/solid/XMarkIcon';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const popupVariants: Record<PopupType, string> = {
	error: 'border-red-100',
	success: 'border-green-200',
	info: 'border-blue-100',
	warning: 'border-yellow-200',
};

const actionPopupButtonClassName: Record<PopupType, string> = {
	error: 'bg-red-400 hover:bg-red-500 focus-visible:outline-red-400',
	success: 'bg-green-400 hover:bg-green-500 focus-visible:outline-green-400',
	info: 'bg-blue-400 hover:bg-blue-500 focus-visible:outline-blue-400',
	warning: 'bg-yellow-400 hover:bg-yellow-500 focus-visible:outline-yellow-400',
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
		<div className={cn('w-full rounded-md border border-l-4 bg-white p-2 py-3 shadow-lg', popupVariants[props.type], 'relative')}>
			<XMarkIcon className='absolute right-1 top-1 h-5 w-5 cursor-pointer rounded-full' onClick={() => removeActionPopup(props.id)} />
			<div className='flex gap-2 rounded-md pr-6'>
				<Icon className={cn('w-b h-6', color)} />
				<div className='text-base font-semibold'>{props.title}</div>
			</div>

			{props.simple ? (
				<div>
					<h3 className='text-sm text-disabled'>{props.description}</h3>
					<div className='mt-2 flex items-center justify-between'>
						<Button
							size='small'
							onClick={() => {
								props.onConfirm();
								removeActionPopup(props.id);
							}}
							className={cn('py-1', actionPopupButtonClassName[props.type])}
						>
							{props.confirmButtonLabel}
						</Button>
						<Button size='small' variant='simple' onClick={() => removeActionPopup(props.id)} className='py-1'>
							Cancel
						</Button>
					</div>
				</div>
			) : (
				props.children
			)}
		</div>
	);
}

const popupContainerClassName = 'absolute top-0 z-[99] max-h-full w-full max-w-80 overflow-hidden flex flex-col gap-2 items-center';

function ActionPopupContainer() {
	const { actionPopups } = usePopups();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return createPortal(
		<div className={cn(popupContainerClassName, 'right-3 mt-4')}>
			{actionPopups.map((actionPopup) => (
				<ActionPopup key={actionPopup.id} {...actionPopup} />
			))}
		</div>,
		document.body
	);
}

export function PopupContainer() {
	return <ActionPopupContainer />;
}
