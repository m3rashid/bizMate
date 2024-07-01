import Confirm from '@components/communications/bulkUploadContactModal/confirm'
import MapFields from '@components/communications/bulkUploadContactModal/mapFields'
import SelectUploadFileType from '@components/communications/bulkUploadContactModal/selectUploadType'
import UploadFile from '@components/communications/bulkUploadContactModal/uploadFile'
import Modal from '@components/lib/modal'
import { BulkUploadContactModalProps, modalTitleMap, useBulkUploadContact } from '@hooks/bulkUploadContact'

function InnerModal(props: BulkUploadContactModalProps) {
	const { modalState, resetModal } = useBulkUploadContact()

	function handleCloseModal() {
		props.setOpen(false)
		resetModal()
	}

	return (
		<Modal open={props.open} setOpen={handleCloseModal} title={modalTitleMap[modalState]}>
			{modalState === 'selectUploadType' ? (
				<SelectUploadFileType />
			) : modalState === 'upload' ? (
				<UploadFile />
			) : modalState === 'mapping' ? (
				<MapFields />
			) : modalState === 'confirm' ? (
				<Confirm {...props} />
			) : null}
		</Modal>
	)
}

function BulkUploadContactModal(props: BulkUploadContactModalProps) {
	return <InnerModal {...props} />
}

export default BulkUploadContactModal
