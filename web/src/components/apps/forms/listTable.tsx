'use client';

import { FormCard } from './card';
import AddEditForm from './editForm';
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
				queryKeys={['getForms']}
				workspaceId={props.workspaceId}
				defaultEmptyStateName='forms'
				otherActions={
					<Button size='small' onClick={() => setOpen(true)} LeftIcon={<PlusIcon className='h-4 w-4' />}>
						New Form
					</Button>
				}
				description='Create and manage all forms'
				tableExportprops={{ tableName: 'forms_table', mutationKeys: [], workspaceId: props.workspaceId }}
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
