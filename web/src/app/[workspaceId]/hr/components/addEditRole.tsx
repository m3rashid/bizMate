import { Button } from '@/components/lib/button';
import { Modal } from '@/components/lib/modal';
import { Role } from '@/utils/types';
import { FormEvent } from 'react';

type AddEditRoleProps = {
	open: boolean;
	workspaceId: string;
	onClose: () => void;
	role?: Role;
};

export function AddEditRole(props: AddEditRoleProps) {
	function handleAddEditRole(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any;
		console.log(formData);
	}

	return (
		<Modal open={props.open} setOpen={props.onClose} title={!!props.role ? `Edit role (${props.role.name})` : 'Create new role'}>
			<form className='h-full' onSubmit={handleAddEditRole}>
				{/* <FormRenderer formBody={formBody} className='flex h-full max-h-96 flex-grow flex-col gap-4 overflow-y-auto p-4' /> */}

				<div className='flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2'>
					<Button variant='simple' type='reset'>
						Reset
					</Button>
					<Button type='submit'>Save</Button>
				</div>
			</form>
		</Modal>
	);
}
