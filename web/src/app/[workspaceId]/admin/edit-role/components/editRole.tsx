'use client';

import { AddEditRole } from '../../components/addEditRole';
import { useGetRoleByRoleIdQuery } from '@/api/permissions/client';
import { PageLoader } from '@/components/lib/loaders';

export function EditRoleComponent(props: { workspaceId: string; roleId: string }) {
	const { data, isLoading } = useGetRoleByRoleIdQuery(props.workspaceId, props.roleId);

	if (isLoading || !data) return <PageLoader />;

	return (
		<>
			<div className='mb-8'>
				<h1 className='text-2xl font-semibold leading-6 text-gray-900'>{`Edit Role (${data.data.name})`}</h1>
				<p className='mt-2 text-sm text-gray-700'>Update this role for this workspace</p>
			</div>

			<AddEditRole workspaceId={props.workspaceId} role={data.data} />
		</>
	);
}
