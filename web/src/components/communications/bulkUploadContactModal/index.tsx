import Confirm from './confirm'
import MapFields from './mapFields'
import Modal from '../../lib/modal'
import UploadFile from './uploadFile'
import SelectUploadFileType from './selectUploadType'
import { BulkUplaodProvider, BulkUploadContactModalProps, modalTitleMap, useBulkUploadContact } from '../../../hooks/bulkUploadContact'

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
	return (
		<BulkUplaodProvider>
			<InnerModal {...props} />
		</BulkUplaodProvider>
	)
}

export default BulkUploadContactModal
