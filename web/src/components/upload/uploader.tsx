import { useState } from 'react'

import Modal from '../lib/modal'
import Button, { ButtonProps } from '../lib/button'

type UploaderProps = {
	buttonProps?: ButtonProps
}

function Uploader(props: UploaderProps) {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button size="small" onClick={() => setOpen(true)} {...props.buttonProps}>
				Choose Files
			</Button>

			<Modal open={open} setOpen={setOpen}></Modal>
		</>
	)
}

export default Uploader
