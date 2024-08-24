'use client';

import { UserDetailModal } from './userDetailTabs';
import { queryKeys } from '@/api/queryKeys';
import { CardList } from '@/components/lib/cardList';
import { Tooltip } from '@/components/lib/tooltip';
import { User } from '@/utils/types';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

function UserCard({ workspaceId, onShowDetail, ...user }: User & { workspaceId: string; onShowDetail: () => void }) {
	return (
		<div className='relative h-min select-none rounded-lg p-2.5 shadow-lg ring-2 ring-gray-100 hover:ring-primary'>
			<div>
				<p
					onClick={onShowDetail}
					className={twMerge('cursor-pointer font-semibold hover:underline', user.deactivated ? 'text-danger' : 'text-gray-800')}
				>
					{user.name}
				</p>
				<p className='text-gray-500'>{user.email}</p>
				{user.phone && user.phone.split(' ')[1] ? <p className='text-gray-500'>{user.phone}</p> : null}
			</div>

			<div className='absolute right-1 top-1'>
				<Tooltip label='User details' position='left'>
					<InformationCircleIcon className='h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-primaryLight' onClick={onShowDetail} />
				</Tooltip>
			</div>
		</div>
	);
}

export function Users(props: { workspaceId: string }) {
	const [detailRow, setDetailRow] = useState<User | undefined>(undefined);

	return (
		<>
			<UserDetailModal open={!!detailRow} onClose={() => setDetailRow(undefined)} {...detailRow!} />

			<CardList<User>
				title='Users'
				paginateUrl={`/auth/${props.workspaceId}/users/all`}
				queryKeys={[queryKeys.users]}
				workspaceId={props.workspaceId}
				defaultEmptyStateName='users'
				description='Manage users in this workspace'
				cardRenderer={(user) => (
					<UserCard
						workspaceId={props.workspaceId}
						{...{
							...user,
							onShowDetail: () => setDetailRow(user),
						}}
					/>
				)}
			/>
		</>
	);
}
