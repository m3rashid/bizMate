import { FormEvent, MouseEvent, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon'

import Modal from './modal'
import TogglerInput from './toggle'
import { PageLoader } from './loader'
import apiClient from '../../api/client'
import { ExportableTable } from '../../types'
import Button, { ButtonProps } from './button'
import SingleSelectInput, { Option } from './singleSelectInput'

export type TableExportProps = {
	tableName: ExportableTable
	mutationKeys?: string[]
	buttonProps?: ButtonProps
	formId?: number
}

const selectOptions: Array<Option> = [
	{ id: 'csv', label: 'CSV', value: 'csv' },
	{ id: 'xlsx', label: 'Excel', value: 'xlsx' },
]

function TableExport(props: TableExportProps) {
	const [open, setOpen] = useState(false)

	const { data: tableFields, isPending } = useQuery<Array<{ name: string; label: string }>>({
		queryKey: [props.tableName, ...(props.mutationKeys || []), ...(props.formId ? [props.formId] : [])],
		queryFn: () =>
			apiClient('/table/export/table-fields', {
				method: 'POST',
				body: JSON.stringify({ tableName: props.tableName, ...(props.formId ? { formId: props.formId } : {}) }),
			}),
	})

	const { mutate: exportTable } = useMutation({
		onSuccess: () => setOpen(false),
		mutationKey: [props.tableName, ...(props.mutationKeys || [])],
		mutationFn: (data: any) => apiClient('/table/export', { method: 'POST', body: JSON.stringify(data) }),
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
				) : !tableFields || tableFields.length === 0 ? (
					<div>
						<label className="block text-sm font-medium leading-6 text-gray-900">No columns to select</label>
					</div>
				) : (
					<form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
						<SingleSelectInput
							name="format"
							label="Export format"
							options={selectOptions}
							default={selectOptions[0].value}
							render={({ option }) => option}
						/>

						<label className="block text-sm font-medium leading-6 text-gray-900">Select Columns to include</label>

						<div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
							{tableFields.map((field) => (
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
