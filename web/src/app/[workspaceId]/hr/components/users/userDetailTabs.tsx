'use client';

import { UserActivity } from './activityTab';
import { UserDetails } from './detailsTab';
import { UserRolesPermissions } from './permissionsTab';
import { Modal } from '@/components/lib/modal';
import { Tab, Tabs } from '@/components/lib/tabs';
import { User } from '@/utils/types';
import { useMemo, useState } from 'react';

export function UserDetailModal({ open, onClose, ...user }: User & { open: boolean; onClose: () => void }) {
	const [selectedTab, setSelectedTab] = useState('details');
	// -- List of actions --
	// remove from workspace
	// change role
	// add/edit bare permissions
	// view activity

	const tabs: Tab<any>[] = useMemo(
		() => [
			{
				id: 'details',
				label: 'User Details',
				Component: UserDetails,
			},
			{
				id: 'permissions',
				label: 'Roles and Permissions',
				Component: UserRolesPermissions,
			},
			{
				id: 'activity',
				label: 'Activity',
				Component: UserActivity,
			},
		],
		[]
	);

	return (
		<Modal open={open} setOpen={onClose} className='p-2 sm:p-4'>
			<Tabs tabs={tabs} {...{ selectedTab, setSelectedTab }} />
		</Modal>
	);
}
