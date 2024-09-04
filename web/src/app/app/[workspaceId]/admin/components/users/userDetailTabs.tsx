'use client';

import { UserDetails } from './detailsTab';
import { UserBarePermissions } from './permissionsTab';
import { UserRoles } from './rolesTab';
import { Modal } from '@/components/lib/modal';
import { Tab, Tabs } from '@/components/lib/tabs';
import { User } from '@/utils/types';
import { useMemo, useState } from 'react';

type UserDetailModalProps = User & {
	open: boolean;
	workspaceId: string;
	onClose: () => void;
};

export function UserDetailModal({ open, onClose, workspaceId, ...user }: UserDetailModalProps) {
	const [selectedTab, setSelectedTab] = useState('details');
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
				label: 'Bare Permissions',
				Component: UserBarePermissions,
				componentProps: { workspaceId, userId: user.id },
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[user.id, workspaceId]
	);

	return (
		<Modal open={open} setOpen={onClose} className='min-h-96 p-2 sm:p-0'>
			<Tabs tabClassName='p-2 pt-4 pl-4' tabs={tabs} {...{ selectedTab, setSelectedTab }} />
		</Modal>
	);
}
