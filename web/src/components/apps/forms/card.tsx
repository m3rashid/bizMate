'use client';

import { useDeleteFormMutation } from '@/api/forms/client';
import { Chip } from '@/components/lib/chip';
import { Tooltip } from '@/components/lib/tooltip';
import { usePopups } from '@/hooks/popups';
import { cn } from '@/utils/helpers';
import { Form } from '@/utils/types';
import EyeIcon from '@heroicons/react/20/solid/EyeIcon';
import LockClosedIcon from '@heroicons/react/20/solid/LockClosedIcon';
import ClipboardIcon from '@heroicons/react/24/outline/ClipboardIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import LockOpenIcon from '@heroicons/react/24/outline/LockOpenIcon';
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function FormCard(props: Form & { onEdit: () => void; workspaceId: string }) {
	const { t } = useTranslation();
	const { addActionPopup } = usePopups();
	const { mutate: deleteForm } = useDeleteFormMutation(props.id, props.workspaceId);

	function handleDeleteForm() {
		addActionPopup({
			simple: true,
			type: 'warning',
			id: 'sureToDeleteForm',
			title: 'Are you sure ?',
			onConfirm: deleteForm,
			confirmButtonLabel: 'Delete',
			description: 'Are you sure you want to delete this form?',
		});
	}

	return (
		<div className='relative h-min select-none rounded-lg p-2.5 shadow-lg ring-2 ring-gray-100 hover:ring-primary'>
			<div className='flex flex-grow gap-2'>
				<Link
					href={`/${props.workspaceId}/forms/${props.id}/preview`}
					className={cn('font-semibold underline', props.active ? 'text-success' : 'text-danger')}
				>
					{props.title}
				</Link>
				<Tooltip
					position='right'
					label={
						<div className='flex flex-col'>
							<div className='flex items-center gap-2'>
								<span>{props.active ? 'This form is active' : 'This form is inactive'}</span>
							</div>
							<div className='flex items-center gap-2'>
								{props.allow_anonymous_responses ? <LockOpenIcon className='h-4 w-4' /> : <LockClosedIcon className='h-4 w-4' />}
								<span>{props.allow_anonymous_responses ? t('Accepting anonymous responses') : t('Not accepting anonymous responses')}</span>
							</div>
						</div>
					}
				>
					<InformationCircleIcon className='h-5 w-5 text-disabled' />
				</Tooltip>
			</div>

			<div className='mb-2 text-xs text-disabled'>
				{t('Created')}: {dayjs(props.created_at).format('DD MMM, YYYY - HH:mm A')}
			</div>
			{props.description ? <div className='text-sm'>{props.description}</div> : null}

			<div className='absolute right-1 top-1'>
				<Tooltip label='Edit Form' position='left'>
					<PencilSquareIcon onClick={props.onEdit} className='h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-primaryLight' />
				</Tooltip>
				<Tooltip label='Delete Form' position='left'>
					<TrashIcon className='h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-dangerLight' onClick={handleDeleteForm} />
				</Tooltip>
			</div>

			<div className='mt-4 flex w-full flex-wrap gap-2'>
				<Tooltip label='Copy Form URL' position='right'>
					<ClipboardIcon
						className='h-7 w-7 cursor-pointer rounded-lg bg-secondary p-1.5 text-white'
						onClick={() => {
							navigator.clipboard.writeText(`${window.location.host}/${props.workspaceId}/forms/${props.id}/fill`);
							toast.success('Copied Form URL to clipboard');
						}}
					/>
				</Tooltip>

				<Tooltip label='Show Form preview' position='right'>
					<Link href={`/${props.workspaceId}/forms/${props.id}/preview`}>
						<Chip>
							<EyeIcon className='h-4 w-4' />
						</Chip>
					</Link>
				</Tooltip>

				<Tooltip label='Show form Responses' position='right'>
					<Link href={`/${props.workspaceId}/forms/${props.id}/responses`}>
						<Chip>Responses</Chip>
					</Link>
				</Tooltip>

				<Tooltip label='Show form Analytics' position='right'>
					<Link href={`/${props.workspaceId}/forms/${props.id}/analytics`}>
						<Chip>Analytics</Chip>
					</Link>
				</Tooltip>
			</div>
		</div>
	);
}
