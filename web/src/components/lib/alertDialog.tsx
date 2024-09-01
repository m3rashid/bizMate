'use client';

import { Button } from './button';
import { Modal } from './modal';
import { cloneElement, PropsWithChildren, ReactNode, useState } from 'react';

export type AlertDialogProps = PropsWithChildren<{
	title: string;
	description: string;
	confirmAction: () => void;
	cancelAction?: () => void;
	confirmLabel?: string;
	cancelLabel?: string;
}>;

export function AlertDialog(props: AlertDialogProps) {
	const [open, setOpen] = useState(false);

	function onConfirm() {
		props.confirmAction();
		setOpen(false);
	}

	function onCancel() {
		if (props.cancelAction) props.cancelAction();
		setOpen(false);
	}

	return (
		<>
			<Modal title={props.title} {...{ open, setOpen }} className='max-w-xs sm:max-w-sm md:max-w-md'>
				<div className='p-2 sm:p-4'>
					<div>{props.description}</div>

					<div className='mt-8 flex items-center justify-end gap-2'>
						<Button size='small' variant='simple' onClick={onCancel}>
							{props.cancelLabel || 'Cancel'}
						</Button>

						<Button size='small' variant='danger' onClick={onConfirm}>
							{props.confirmLabel || 'Confirm'}
						</Button>
					</div>
				</div>
			</Modal>

			{cloneElement(props.children as any, { onClick: () => setOpen(true) })}
		</>
	);
}
