'use client';

import { queryKeys } from '@/api/queryKeys';
import { Button } from '@/components/lib/button';
import { CardList } from '@/components/lib/cardList';
import { Chip } from '@/components/lib/chip';
import { UnAuthorizedPage } from '@/components/lib/notFound';
import { Tooltip } from '@/components/lib/tooltip';
import { usePermission } from '@/hooks/permission';
import { PERMISSION_READ, permissionLevelNumberToStringMap } from '@/utils/constants';
import { Role } from '@/utils/types';
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';

function RoleCard({ workspaceId, ...role }: Role & { workspaceId: string; onEdit: () => void }) {
	return (
		<div className='relative h-min select-none rounded-lg p-2.5 shadow-lg ring-2 ring-gray-100 hover:ring-primary'>
			<div>
				<p className='font-semibold text-gray-800'>{role.name}</p>
				<p className='text-sm text-gray-500'>{role.description}</p>
			</div>

			<div className='mt-2 flex flex-wrap items-center gap-2'>
				{role.permissions.map((perm, index) => (
					<Chip className='bg-primaryLight text-gray-600' size='small' key={index}>
						{perm.object_type} : {permissionLevelNumberToStringMap[perm.level]}
					</Chip>
				))}
			</div>
			<div className='absolute right-1 top-1'>
				<Tooltip label='Edit role' position='left'>
					<PencilSquareIcon className='h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-primaryLight' onClick={role.onEdit} />
				</Tooltip>
			</div>
		</div>
	);
}

export function Roles(props: { workspaceId: string }) {
	const router = useRouter();
	const { hasPermission } = usePermission();

	if (!hasPermission('role', PERMISSION_READ)) return <UnAuthorizedPage />;
	return (
		<CardList<Role>
			title='Roles'
			paginateUrl={`/${props.workspaceId}/permissions/roles/all`}
			queryKeys={[queryKeys.roles]}
			workspaceId={props.workspaceId}
			defaultEmptyStateName='roles'
			otherActions={
				<Button size='small' onClick={() => router.push(`/app/${props.workspaceId}/admin/add-role`)} LeftIcon={<PlusIcon className='h-4 w-4' />}>
					New Role
				</Button>
			}
			description='Manage all roles'
			cardRenderer={(role) => (
				<RoleCard workspaceId={props.workspaceId} onEdit={() => router.push(`/app/${props.workspaceId}/admin/edit-role/${role.id}`)} {...role} />
			)}
		/>
	);
}
