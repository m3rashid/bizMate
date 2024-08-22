'use client';

import { apiClient } from '@/api/config';
import { getQueryClient } from '@/api/provider';
import { queryKeys } from '@/api/queryKeys';
import { Button } from '@/components/lib/button';
import { Input } from '@/components/lib/input';
import { Modal } from '@/components/lib/modal';
import { TextAreaInput } from '@/components/lib/textAreaInput';
import { usePopups } from '@/hooks/popups';
import { isUuid } from '@/utils/helpers';
import { Workspace } from '@/utils/types';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function WorkspaceCard(workspace: Workspace) {
	const router = useRouter();

	function handleSelectWorkspace() {
		if (!isUuid(workspace.id)) return;
		router.push('/' + workspace.id);
	}

	return (
		<div
			onClick={handleSelectWorkspace}
			className='flex h-52 w-52 cursor-pointer select-none items-center justify-center rounded-lg bg-white p-2.5 shadow-lg ring-2 ring-gray-100 hover:ring-primary'
		>
			<h3 className='text-center'>{workspace.name}</h3>
		</div>
	);
}

export function CreateWorkspace() {
	const { t } = useTranslation();
	const { addMessagePopup } = usePopups();
	const [open, setOpen] = useState(false);

	const { mutateAsync: createWorkspace } = useMutation({
		mutationKey: [queryKeys.workspaces],
		onError: () => addMessagePopup({ id: 'wsCreateFailed', type: 'error', message: 'Failed to create workspace' }),
		onSuccess: () => {
			addMessagePopup({ id: 'wsCreated', type: 'success', message: 'Workspace created successfully' });
			setOpen(false);
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaces] });
		},
		mutationFn: (data: { name: string; description: string; color: string }) => apiClient('/auth/workspaces/create', { method: 'POST', data: data }),
	});

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
						<Input name='color' type='color' label='Color' defaultValue='#ffffff' required />
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
