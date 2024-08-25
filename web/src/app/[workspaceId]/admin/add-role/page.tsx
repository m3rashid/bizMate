import { AddEditRole } from '../components/addEditRole';
import { PageContainer } from '@/components/pageContainer';
import { NextjsPageProps } from '@/utils/types';

export default async function AddRole(props: NextjsPageProps<{ workspaceId: string }>) {
	return (
		<PageContainer bodyClassName='bg-white' workspaceId={props.params.workspaceId}>
			<div className='mb-8'>
				<h1 className='text-2xl font-semibold leading-6 text-gray-900'>Add Role</h1>
				<p className='mt-2 text-sm text-gray-700'>Add a new role for this workspace</p>
			</div>

			<AddEditRole workspaceId={props.params.workspaceId} />
		</PageContainer>
	);
}
