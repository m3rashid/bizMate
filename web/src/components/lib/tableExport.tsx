import { FormEvent, MouseEvent, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon'

import Modal from './modal'
import TogglerInput from './toggle'
import { PageLoader } from './loader'
import apiClient from '../../api/client'
import { ExportableTable } from '../../types'
import Button, { ButtonProps } from './button'
import { usePopups } from '../../hooks/popups'
import SingleSelectInput, { Option } from './singleSelectInput'

export type TableExportProps = {
	tableName: ExportableTable
	formId?: number
	mutationKeys?: string[]
	buttonProps?: ButtonProps
}

const selectOptions: Array<Option> = [
	{ label: 'CSV', value: 'csv' },
	{ label: 'Excel', value: 'xlsx' },
]

function TableExport(props: TableExportProps) {
	const { addMessagePopup } = usePopups()
	const [open, setOpen] = useState(false)

	const { data: tableFieldsData, isPending } = useQuery<{ csvFileName: string; fields: Array<{ name: string; label: string }> }>({
		queryKey: [props.tableName, ...(props.mutationKeys || []), ...(props.formId ? [props.formId] : [])],
		queryFn: () =>
			apiClient('/table/export/table-fields', {
				method: 'POST',
				body: JSON.stringify({ tableName: props.tableName, ...(props.formId ? { formId: props.formId } : {}) }),
			}),
	})

	const { mutate: exportTable } = useMutation({
		onSuccess: () => setOpen(false),
		onError: (error, variables) => {
			setOpen(false)
			addMessagePopup({
				type: 'error',
				message: (error as any) || 'An error occurred',
				id: tableFieldsData?.csvFileName || `${props.tableName}.${variables.format}`,
			})
		},
		mutationKey: [props.tableName, ...(props.mutationKeys || [])],
		mutationFn: (data: any) =>
			apiClient(
				'/table/export',
				{ method: 'POST', body: JSON.stringify(data) },
				{ downloadableContent: { fileName: tableFieldsData?.csvFileName || `${props.tableName}.${data.format}` } },
			),
	})

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		const fields: string[] = []
		for (const key in formData) {
			if (formData[key] === 'on') fields.push(key)
		}
		exportTable({ fields, tableName: props.tableName, format: formData.format, ...(props.formId ? { formId: props.formId } : {}) })
	}

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
	}

	return (
		<>
			<Button size="small" variant="sucess" LeftIcon={<TableCellsIcon className="h-5 w-5" />} {...props.buttonProps} onClick={() => setOpen(true)}>
				Export
			</Button>

			<Modal title="Export Data" {...{ open, setOpen }}>
				{isPending ? (
					<PageLoader />
				) : !tableFieldsData || tableFieldsData.fields.length === 0 ? (
					<div>
						<label className="block text-sm font-medium leading-6 text-gray-900">No columns to select</label>
					</div>
				) : (
					<form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
						<SingleSelectInput name="format" label="Export format" options={selectOptions} default={selectOptions[0].value} />

						<label className="block text-sm font-medium leading-6 text-gray-900">Select Columns to include</label>

						<div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
							{tableFieldsData.fields.map((field) => (
								<TogglerInput key={field.name} name={field.name} label={field.label} defaultChecked />
							))}
						</div>

						<div className="flex flex-grow-0 items-center justify-between pt-3">
							<Button variant="simple" onClick={handleReset}>
								Reset
							</Button>
							<Button type="submit">Export</Button>
						</div>
					</form>
				)}
			</Modal>
		</>
	)
}

export default TableExport
