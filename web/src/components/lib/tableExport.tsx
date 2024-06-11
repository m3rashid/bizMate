import { FormEvent, MouseEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import Modal from './modal'
import apiClient from '../../api/client'
import SingleSelectInput, { Option } from './singleSelectInput'
import Button, { ButtonProps } from './button'
import { TableCellsIcon } from '@heroicons/react/24/outline'

export type TableExportProps = {
	tableName: string
	mutationKeys: string[]
	buttonProps?: ButtonProps
}

const selectOptions: Array<Option> = [
	{ id: 'xlsx', label: 'Excel', value: 'xlsx' },
	{ id: 'csv', label: 'CSV', value: 'csv' },
]

function TableExport(props: TableExportProps) {
	const [open, setOpen] = useState(false)

	const { mutate } = useMutation({
		onSuccess: () => setOpen(false),
		mutationKey: props.mutationKeys,
		mutationFn: (data: any) => apiClient('', { method: 'POST', body: JSON.stringify(data) }),
	})

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		console.log({ ...formData, tableName: props.tableName })
	}

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
	}

	return (
		<>
			<Button size="small" variant="sucess" LeftIcon={<TableCellsIcon className="h-4 w-4" />} {...props.buttonProps} onClick={() => setOpen(true)}>
				Export Data
			</Button>

			<Modal title="Export Data" {...{ open, setOpen }}>
				<form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
					<SingleSelectInput
						name="format"
						label="Export format"
						options={selectOptions}
						default={selectOptions[0].value}
						render={({ option }) => option}
					/>

					<div className="flex flex-grow-0 items-center justify-between pt-3">
						<Button variant="simple" onClick={handleReset}>
							Reset
						</Button>
						<Button type="submit">Save</Button>
					</div>
				</form>
			</Modal>
		</>
	)
}

export default TableExport
