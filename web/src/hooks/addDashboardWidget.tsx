import { Widget } from '../types'
import { usePopups } from './popups'
import { atom, useRecoilState } from 'recoil'

type WidgetType = 'kpi' | 'chart' | null
type ModalState = 'selectType' | 'fillDetails' | 'confirm' | null
type AddDashboardWidget = {
	modalOpen: boolean
	data: Partial<Widget> | null
	widgetType: WidgetType
	modalState: ModalState
}

const defaultAddDashboardWidget: AddDashboardWidget = {
	data: null,
	modalOpen: false,
	widgetType: null,
	modalState: 'selectType',
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
		setAddDashboardWidget((prev) => ({ ...prev, widgetType, modalState: 'fillDetails' }))
	}

	function closeModal() {
		setAddDashboardWidget(defaultAddDashboardWidget)
	}

	function goBack() {
		setAddDashboardWidget((prev) => ({
			...prev,
			modalState: prev.modalState === 'fillDetails' ? 'selectType' : prev.modalState === 'confirm' ? 'fillDetails' : 'selectType',
		}))
	}

	return {
		...addDashboardWidget,
		setWidgetType,
		closeModal,
		goBack,
	}
}

export default useAddDashboardWidget
