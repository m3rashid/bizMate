import apiClient from '../../api/client'
import useAddDashboardWidget from '../../hooks/addDashboardWidget'
import { usePopups } from '../../hooks/popups'
import { kpiAggregationType } from '../../types'
import Button from '../lib/button'
import Input from '../lib/input'
import SingleSelectInput from '../lib/singleSelectInput'
import TextAreaInput from '../lib/textAreaInput'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FormEvent, useMemo, useState } from 'react'

function AddKpiModel({ dashboardId }: { dashboardId: string | number }) {
	const { addMessagePopup } = usePopups()
	const [selectedModel, setSelectedModel] = useState<string>('')
	const { widgetType, closeModal } = useAddDashboardWidget()

	const { data: dashboardModels } = useQuery({
		queryKey: ['dashboardModels'],
		queryFn: () => apiClient('/dashboards/models'),
	})

	const { mutate: createKpi } = useMutation({
		mutationKey: ['addDashboardKpi'],
		mutationFn: (kpiData: any) => apiClient(`/dashboards/kpis/${dashboardId}/create`, { method: 'POST', body: JSON.stringify(kpiData) }),
		onSuccess: () => {
			closeModal()
			addMessagePopup({ message: 'Kpi created successfully', type: 'success', id: 'add-kpi-success' })
		},
	})

	const selectedModelFields = useMemo(() => {
		if (!dashboardModels || !selectedModel) return []
		return Object.entries(dashboardModels[selectedModel]).reduce<string[]>((acc, [key, val]) => [...acc, ...(val === 'number' ? [key] : [])], [])
	}, [selectedModel])

	function handleAddKpi(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (!formData.model || !formData.modelField || !formData.aggregationType || !formData.title || !formData.timePeriod) {
			addMessagePopup({ message: 'Please fill all required fields', type: 'error', id: 'add-kpi-error' })
			return
		}
		createKpi({ ...formData, timePeriod: Number(formData.timePeriod) })
	}

	if (widgetType !== 'kpi') return null
	return (
		<form className="h-full" onSubmit={handleAddKpi}>
			<div className="flex flex-col gap-4 p-4">
				<Input name="title" label="KPI Title" required />
				<TextAreaInput name="description" label="Description" />

				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
					<SingleSelectInput
						required
						name="model"
						label="Chose data model"
						value={selectedModel}
						onChange={(val) => setSelectedModel(val)}
						options={Object.keys(dashboardModels || {})}
						descriptionText="Type of the data model you want to aggregate"
					/>
					<SingleSelectInput
						required
						name="modelField"
						label="Data model field"
						options={selectedModelFields}
						descriptionText="Field of the data model you want aggregate"
					/>
				</div>

				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
					<SingleSelectInput
						required
						name="aggregationType"
						label="Aggregation type"
						options={kpiAggregationType as any}
						descriptionText="Operation to be performed on the data model field"
					/>
					<Input
						rootClassName="sm:w-64"
						type="number"
						name="timePeriod"
						label="Time period"
						required
						descriptionText="Data for n number of days before"
					/>
				</div>
			</div>
			<div className="flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2">
				<Button variant="simple" type="reset">
					Reset
				</Button>
				<Button type="submit">Confirm</Button>
			</div>
		</form>
	)
}

export default AddKpiModel
