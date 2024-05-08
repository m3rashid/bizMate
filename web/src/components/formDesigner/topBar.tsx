import InfoButton from '@heroicons/react/24/outline/InformationCircleIcon'

import Button from '../lib/button'
import Tooltip from '../lib/tooltip'
import { useFormDesigner } from '../../hooks/formDesigner'

function FormDesignerTopBar() {
	const { viewType, changeViewType, meta, cancelText, submitText } = useFormDesigner()

	function handleSaveForm() {
		console.log('Save form', { meta, submitText, cancelText })
	}

	return (
		<div className="mb-2 flex w-full items-center justify-between rounded-lg bg-white px-4 py-2">
			<Button
				size="small"
				variant="simple"
				onClick={() => changeViewType()}
				label={viewType === 'build' ? 'Show Preview' : 'Designer View'}
			/>

			<div className="flex items-center gap-4">
				<Button size="small" label="Save form" onClick={handleSaveForm} />
				<Tooltip
					label={
						<ul className="block list-disc pl-4">
							<li className="list-item">Double click on any element to select</li>
							<li className="list-item">Click on the elements in the left panel to add to form</li>
						</ul>
					}
				>
					<InfoButton className="h-8 w-8" />
				</Tooltip>
			</div>
		</div>
	)
}

export default FormDesignerTopBar
