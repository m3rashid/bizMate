import { MouseEvent } from 'react'

import Button from '../lib/button'
import { useFormDesigner } from '../../hooks/formDesigner'

function RightSidebar() {
	const { selectedNode, getSelectedNodeProps } = useFormDesigner()
	const props = getSelectedNodeProps()

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.stopPropagation()
		e.preventDefault()
		// reset the form
	}

	function handleSave() {}

	return (
		<form className="flex h-full flex-col gap-4" onSubmit={handleSave}>
			{selectedNode ? (
				<div className="h-full flex-grow overflow-y-auto">
					<pre>{JSON.stringify(props, null, 2)}</pre>
				</div>
			) : null}

			{selectedNode ? (
				<div className="flex flex-grow-0 items-center justify-between border-t-2 pt-3">
					<Button type="submit">Save</Button>
					<Button variant="simple" onClick={handleReset}>
						Reset
					</Button>
				</div>
			) : null}
		</form>
	)
}

export default RightSidebar
