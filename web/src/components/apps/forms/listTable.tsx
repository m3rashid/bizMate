'use client';

import { FormCard } from './card';
import AddEditForm from './editForm';
import { queryKeys } from '@/api/queryKeys';
import { Button } from '@/components/lib/button';
import { CardList } from '@/components/lib/cardList';
import { Form } from '@/utils/types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

type ListFormsProps = {
	workspaceId: string;
};

export function ListForms(props: ListFormsProps) {
	const [open, setOpen] = useState(false);
	const [editRow, setEditRow] = useState<Form | undefined>(undefined);

	return (
		<>
			<AddEditForm
				open={open}
				refetch={() => {}}
				workspaceId={props.workspaceId}
				form={!!editRow ? editRow : undefined}
				onClose={() => {
					setOpen(false);
					setEditRow(undefined);
				}}
			/>

			<CardList<Form>
				title='Forms'
				paginateUrl={`/${props.workspaceId}/forms/all`}
				queryKeys={[queryKeys.forms]}
				workspaceId={props.workspaceId}
				defaultEmptyStateName='forms'
				otherActions={
					<Button size='small' onClick={() => setOpen(true)} LeftIcon={<PlusIcon className='h-4 w-4' />}>
						New Form
					</Button>
				}
				description='Create and manage all forms'
				tableExportprops={{ tableName: 'forms_table', mutationKeys: [], workspaceId: props.workspaceId }}
				// emptyState={
				// 	<div className='flex h-72 flex-col items-center justify-center gap-4 rounded-md border-2 border-gray-200'>
				// 		<div className='text-center'>
				// 			<h3 className='text-lg font-semibold text-gray-800'>No forms</h3>
				// 			<p className='text-sm text-gray-500'>Create a form for your audience </p>
				// 		</div>
				// 	</div>
				// }
				cardRenderer={(form) => (
					<FormCard
						workspaceId={props.workspaceId}
						{...{
							...form,
							onEdit: () => {
								setEditRow(form);
								setOpen(true);
							},
						}}
					/>
				)}
			/>
		</>
	);
}
