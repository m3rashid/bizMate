'use client';

import { apiClient } from '@/api/config';
import { Button, ButtonProps } from '@/components/lib/button';
import { PageLoader } from '@/components/lib/loaders';
import { Modal } from '@/components/lib/modal';
import { SingleSelectInput } from '@/components/lib/singleSelectInput';
import { TogglerInput } from '@/components/lib/toggle';
import { usePopups } from '@/hooks/popups';
import { ApiResponse, ExportableTable, Option } from '@/utils/types';
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type TableExportProps = {
	tableName: ExportableTable;
	workspaceId: string;
	formId?: string;
	mutationKeys?: string[];
	buttonProps?: ButtonProps;
};

const selectOptions: Option[] = [
	{ label: 'CSV', value: 'csv' },
	{ label: 'Excel', value: 'xlsx' },
];

export function TableExport(props: TableExportProps) {
	const { t } = useTranslation();
	const { addMessagePopup } = usePopups();
	const [open, setOpen] = useState(false);

	const { data: result, isPending } = useQuery<ApiResponse<{ fileNameWithoutExt: string; fields: Array<{ name: string; label: string }> }>>({
		queryKey: [props.tableName, props.workspaceId, ...(props.mutationKeys || []), ...(props.formId ? [props.formId] : [])],
		queryFn: () =>
			apiClient(`/${props.workspaceId}/export/table-fields`, {
				method: 'POST',
				body: JSON.stringify({ tableName: props.tableName, ...(props.formId ? { formId: props.formId } : {}) }),
			}),
	});

	const { mutate: exportTable } = useMutation({
		onSuccess: () => setOpen(false),
		onError: (error, variables) => {
			setOpen(false);
			addMessagePopup({
				type: 'error',
				message: (error as any) || 'An error occurred',
				id: `${result?.data.fileNameWithoutExt}.${variables.format}` || `${props.tableName}.${variables.format}`,
			});
		},
		mutationKey: [props.tableName, ...(props.mutationKeys || [])],
		mutationFn: (data: any) =>
			apiClient(
				`/${props.workspaceId}/export/table`,
				{ method: 'POST', body: JSON.stringify(data) },
				{
					downloadableContent: {
						fileName: `${result?.data.fileNameWithoutExt}.${data.format}` || `${props.tableName}.${data.format}`,
					},
				}
			),
	});

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any;
		const fields: string[] = [];
		for (const key in formData) {
			if (formData[key] === 'on') fields.push(key);
		}
		exportTable({
			fields,
			tableName: props.tableName,
			format: formData.format,
			...(props.formId ? { formId: props.formId } : {}),
		});
	}

	return (
		<>
			<Button size='small' variant='sucess' LeftIcon={<TableCellsIcon className='h-5 w-5' />} {...props.buttonProps} onClick={() => setOpen(true)}>
				{t('Export')}
			</Button>

			<Modal title='Export Data' open={open} setOpen={() => () => setOpen(false)}>
				{isPending ? (
					<PageLoader />
				) : !result || result.data.fields.length === 0 ? (
					<div>
						<label className='block text-sm font-medium leading-6 text-gray-900'>{t('No columns to select')}</label>
					</div>
				) : (
					<form className='flex w-full flex-col gap-4' onSubmit={handleSubmit}>
						<div className='px-4'>
							<SingleSelectInput name='format' label='Export format' options={selectOptions} />
						</div>

						<label className='block px-4 text-sm font-medium leading-6 text-gray-900'>{t('Select Columns to include')}</label>

						<div className='grid max-h-80 grid-cols-1 gap-2 overflow-auto p-4 pt-0 md:grid-cols-2 md:gap-4'>
							{result.data.fields.map((field) => (
								<TogglerInput key={field.name} name={field.name} label={field.label} defaultChecked />
							))}
						</div>

						<div className='flex flex-grow-0 items-center justify-between p-4'>
							<Button variant='simple' type='reset'>
								{t('Reset')}
							</Button>
							<Button type='submit'>{t('Export')}</Button>
						</div>
					</form>
				)}
			</Modal>
		</>
	);
}
