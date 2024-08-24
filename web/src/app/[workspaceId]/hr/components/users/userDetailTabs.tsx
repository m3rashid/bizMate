'use client';

import { UserDetails } from './detailsTab';
import { UserPermissions } from './permissionsTab';
import { UserRoles } from './rolesTab';
import { Modal } from '@/components/lib/modal';
import { Tab, Tabs } from '@/components/lib/tabs';
import { User } from '@/utils/types';
import { useMemo, useState } from 'react';

export function UserDetailModal({ open, onClose, workspaceId, ...user }: User & { open: boolean; workspaceId: string; onClose: () => void }) {
	const [selectedTab, setSelectedTab] = useState('details');
	// -- List of actions --
	// remove from workspace
	// change role
	// add/edit bare permissions

	const tabs: Tab<any>[] = useMemo(
		() => [
			{
				id: 'details',
				label: 'User Details',
				Component: UserDetails,
				componentProps: { workspaceId, user },
			},
			{
				id: 'roles',
				label: 'Roles',
				Component: UserRoles,
				componentProps: { workspaceId, userId: user.id },
			},
			{
				id: 'permissions',
				label: 'Permissions',
				Component: UserPermissions,
				componentProps: { workspaceId, userId: user.id },
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[user.id, workspaceId]
	);

	return (
		<Modal open={open} setOpen={onClose} className='p-2 sm:p-4'>
			<Tabs tabs={tabs} {...{ selectedTab, setSelectedTab }} />
		</Modal>
	);
}
