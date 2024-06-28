import { usePopups } from './popups'
import { atom, useRecoilState } from 'recoil'

type WidgetType = 'kpi' | 'chart' | null
type AddDashboardWidget = {
	modalOpen: boolean
} & ({ widgetType: 'kpi'; data: KpiFields } | { widgetType: 'chart'; data: ChartFields }) &
	({ modalState: 'selectType'; modalTitle: 'Select widget type' } | { modalState: 'fillDetails'; modalTitle: 'Fill widget Details' })

type ChartFields = {}

type KpiFields = {
	model: string
	modelField: string
	aggregationType: string
}

const defaultKpiFields: KpiFields = {
	model: '',
	modelField: '',
	aggregationType: '',
}

const defaultChartFields: ChartFields = {}

const defaultAddDashboardWidget: AddDashboardWidget = {
	modalOpen: false,
	widgetType: 'kpi',
	data: defaultKpiFields,
	modalState: 'selectType',
	modalTitle: 'Select widget type',
}

const addDashboardAtom = atom<AddDashboardWidget>({
	key: 'addDashboardAtom',
	default: defaultAddDashboardWidget,
})

function useAddDashboardWidget() {
	const { addMessagePopup } = usePopups()

	const [addDashboardWidget, setAddDashboardWidget] = useRecoilState(addDashboardAtom)

	function setWidgetType(widgetType: WidgetType) {
		if (!widgetType) {
			addMessagePopup({ id: 'noWidgetTypeSelected', type: 'error', message: 'Widget type not selected' })
			return
		}
		setAddDashboardWidget((prev) => ({
			...prev,
			modalState: 'fillDetails',
			modalTitle: 'Fill widget Details',
			...(widgetType === 'chart' ? { widgetType, data: defaultChartFields } : widgetType === 'kpi' ? { widgetType, data: defaultKpiFields } : {}),
		}))
	}

	function closeModal() {
		setAddDashboardWidget(defaultAddDashboardWidget)
	}

	function openModal() {
		setAddDashboardWidget((prev) => ({ ...prev, modalOpen: true }))
	}

	function goBack() {
		setAddDashboardWidget((prev) => ({
			...prev,
			...(prev.modalState === 'fillDetails'
				? { modalState: 'selectType', modalTitle: 'Select widget type' }
				: { modalState: 'selectType', modalTitle: 'Select widget type' }),
		}))
	}

	return {
		...addDashboardWidget,
		setWidgetType,
		closeModal,
		openModal,
		goBack,
	}
}

export default useAddDashboardWidget
