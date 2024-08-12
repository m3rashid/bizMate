'use client';

import { Button } from '@/components/lib/button';
import { Modal } from '@/components/lib/modal';
import { ShowRichText } from '@/components/lib/showRichText';
import { TableColumn } from '@/components/lib/table';
import { CreatedBy, Form, FormResponse, PaginationResponse } from '@/utils/types';
import dayjs from 'dayjs';
import { useState } from 'react';

export type FormResponsesType = {
	form: Form;
};

function ShowRichTextData(props: { data: any; label: string }) {
	const [modalOpen, setModalOpen] = useState(false);
	return (
		<>
			<Button size='small' onClick={() => setModalOpen(true)}>
				Show Contents
			</Button>
			<Modal open={modalOpen} setOpen={setModalOpen} title={props.label}>
				<ShowRichText data={props.data} className='my-0 border-2 border-borderColor p-0 shadow-none' />
			</Modal>
		</>
	);
}

export function parseFormResponses(
	form: Form,
	data: PaginationResponse<FormResponse>
): { data: PaginationResponse<FormResponse>; tableData: Array<TableColumn<any>> } {
	try {
		if (!Array.isArray(form.form_body)) throw new Error('Invalid form body');
		const formFields: Record<string, [string, boolean, boolean]> = {}; // Record<name, [label, required, isRichTextField]>
		for (let i = 0; i < form.form_body.length; i++) {
			if (!form.form_body[i].props || !form.form_body[i].props.name) continue;
			formFields[form.form_body[i].props.name] = [
				form.form_body[i].props.label || form.form_body[i].props.name,
				form.form_body[i].props.required || false,
				form.form_body[i].name === 'richTextInput',
			];
		}

		const formFieldKeys = Object.keys(formFields);
		const responses: Array<FormResponse> = [];
		for (let i = 0; i < data.docs.length; i++) {
			try {
				const formRes = data.docs[i].response as any;
				for (let j = 0; j < formFieldKeys.length; j++) {
					if (typeof formRes[formFieldKeys[j]] !== 'boolean' && !formRes[formFieldKeys[j]]) formRes[formFieldKeys[j]] = 'N/A';
				}

				responses.push({
					...formRes,
					id: data.docs[i].id,
					deviceIp: data.docs[i].deviceIp,
					createdAt: data.docs[i].created_at,
					...(!form.allow_anonymous_responses ? { createdByUser: data.docs[i].created_by_id } : {}),
				});
			} catch (err) {
				console.error('Error in parsing form response: ', err);
				continue;
			}
		}
		return {
			data: { ...data, docs: responses },
			tableData: Object.entries(formFields).reduce<Array<TableColumn<any>>>(
				(acc, [name, [label, _, isRichTextField]]) => [
					isRichTextField
						? {
								title: label,
								dataKey: name,
								render: ({ row }) => <ShowRichTextData data={row[name]} label={label} />,
							}
						: { title: label, dataKey: name },
					...acc,
				],
				[
					{ title: 'Created At', dataKey: 'createdAt', render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A') },
					...(!form.allow_anonymous_responses
						? [
								{
									title: 'Submitted By',
									dataKey: 'createdByUser',
									render: ({ row: { created_by_id } }: { row: CreatedBy }) => {
										return (
											<div className='flex flex-col'>
												<span className='text-sm text-disabled'>{created_by_id}</span>
											</div>
										);
									},
								},
							]
						: []),
				]
			),
		};
	} catch (err) {
		return { data: data, tableData: [] };
	}
}
