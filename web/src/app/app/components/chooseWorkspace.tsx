'use client';

import { useCreateWorkspaceMutation } from '@/api/workspaces/client';
import { Button } from '@/components/lib/button';
import { Input } from '@/components/lib/input';
import { Modal } from '@/components/lib/modal';
import { TextAreaInput } from '@/components/lib/textAreaInput';
import { isUuid } from '@/utils/helpers';
import { Workspace } from '@/utils/types';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

function WorkspaceCardBg(props: { color: string }) {
	if (!props.color || !props.color.startsWith('#')) return null;
	return (
		<svg width='100%' height='100%' viewBox='0 0 400 400' className='absolute rounded-lg'>
			<rect fill='#fff' width='400' height='400' />
			<g fillOpacity='1'>
				<circle fill={props.color} opacity={0.1} cx='0' cy='400' r='400' />
				<circle fill={props.color} opacity={0.2} cx='0' cy='400' r='300' />
				<circle fill={props.color} opacity={0.3} cx='0' cy='400' r='200' />
				<circle fill={props.color} opacity={0.4} cx='0' cy='400' r='100' />
			</g>
		</svg>
	);
}

export function WorkspaceCard(workspace: Workspace) {
	const router = useRouter();

	function handleSelectWorkspace() {
		if (!isUuid(workspace.id)) return;
		router.push('/app/' + workspace.id);
	}

	return (
		<div
			onClick={handleSelectWorkspace}
			className='relative flex h-52 w-52 cursor-pointer select-none items-center justify-center overflow-hidden rounded-lg bg-white p-2.5 shadow-lg ring-2 ring-gray-100 hover:ring-primary'
		>
			<WorkspaceCardBg color={workspace.color} />
			<h3 className='z-50 text-center font-semibold'>{workspace.name}</h3>
		</div>
	);
}

export function CreateWorkspace() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const { mutateAsync: createWorkspace } = useCreateWorkspaceMutation({ onSuccess: () => setOpen(false) });

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any;
		if (!formData.name || !formData.color) return;
		createWorkspace({ name: formData.name, description: formData.description, color: formData.color });
	}

	return (
		<>
			<div
				onClick={() => setOpen(true)}
				className='group flex h-52 w-52 cursor-pointer select-none items-center justify-center rounded-lg bg-white p-2.5 shadow-lg ring-2 ring-gray-100 hover:ring-primary'
			>
				<div className='flex flex-col items-center justify-center rounded-lg bg-skeletonLight p-4 group-hover:bg-skeletonDark'>
					<PlusIcon className='h-20 w-20 text-disabled group-hover:text-black' />
					{t('New workspace')}
				</div>
			</div>

			<Modal title='Create new workspace' open={open} setOpen={() => setOpen(false)} className='md:max-w-xl'>
				<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
					<div className='flex flex-col gap-4 p-4'>
						<Input name='name' type='name' label='Name' placeholder='BizMate Hero' required />
						<Input name='color' type='color' label='Color' defaultValue='#f48a8a' required />
						<TextAreaInput name='description' label='Description' />
					</div>

					<div className='flex items-center justify-between border-t border-borderColor p-2'>
						<Button size='small' variant='simple' type='button' onClick={() => setOpen(false)}>
							{t('Close')}
						</Button>
						<Button size='small' type='submit'>
							{t('Create workspace')}
						</Button>
					</div>
				</form>
			</Modal>
		</>
	);
}
