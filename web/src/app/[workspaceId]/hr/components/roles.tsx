import { AddEditRole } from './addEditRole';
import { queryKeys } from '@/api/queryKeys';
import { Button } from '@/components/lib/button';
import { CardList } from '@/components/lib/cardList';
import { Tooltip } from '@/components/lib/tooltip';
import { Role } from '@/utils/types';
import { InformationCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function RoleCard({ workspaceId, onShowDetail, ...role }: Role & { workspaceId: string; onShowDetail: () => void }) {
	return (
		<div className='relative h-min select-none rounded-lg p-2.5 shadow-lg ring-2 ring-gray-100 hover:ring-primary'>
			<div>
				<p className='font-semibold text-gray-800'>{role.name}</p>
				{role.description ? <p className='text-gray-500'>{role.description}</p> : null}
			</div>

			<div className='absolute right-1 top-1'>
				<Tooltip label='User details' position='left'>
					<InformationCircleIcon className='h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-primaryLight' onClick={onShowDetail} />
				</Tooltip>
			</div>
		</div>
	);
}

export function Roles(props: { workspaceId: string }) {
	const [open, setOpen] = useState(false);
	const [detailRow, setDetailRow] = useState<Role | undefined>(undefined);

	return (
		<>
			<AddEditRole
				open={open}
				workspaceId={props.workspaceId}
				role={detailRow}
				onClose={() => {
					setOpen(false);
					setDetailRow(undefined);
				}}
			/>

			<CardList<Role>
				title='Roles'
				paginateUrl={`/${props.workspaceId}/permissions/roles/all`}
				queryKeys={[queryKeys.roles]}
				workspaceId={props.workspaceId}
				defaultEmptyStateName='roles'
				otherActions={
					<Button size='small' onClick={() => setOpen(true)} LeftIcon={<PlusIcon className='h-4 w-4' />}>
						New Role
					</Button>
				}
				description='Manage all roles'
				cardRenderer={(role) => (
					<RoleCard
						workspaceId={props.workspaceId}
						{...{
							...role,
							onShowDetail: () => {
								setDetailRow(role);
								setOpen(true);
							},
						}}
					/>
				)}
			/>
		</>
	);
}
