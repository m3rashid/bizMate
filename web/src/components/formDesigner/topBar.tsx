import apiClient from '../../api/client'
import { useFormDesigner } from '../../hooks/formDesigner'
import { usePopups } from '../../hooks/popups'
import { Form, StringBoolean } from '../../types'
import Button from '../lib/button'
import Tooltip from '../lib/tooltip'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

function FormDesignerTopBar() {
	const navigate = useNavigate()
	const { addMessagePopup } = usePopups()
	const { viewType, changeViewType, meta, rootProps } = useFormDesigner()

	const { isPending, mutate: saveForm } = useMutation({
		mutationKey: ['saveForm'],
		onError: () => addMessagePopup({ id: 'errorCreateForm', message: 'Error in creating form', type: 'error' }),
		mutationFn: async (body: any) => apiClient('/forms/create', { method: 'POST', body: JSON.stringify(body) }),
		onSuccess: () => {
			navigate({ to: '/forms', search: { page: 1 } })
			addMessagePopup({ id: 'saveForm', message: 'Successfully created form', type: 'success' })
		},
	})

	function handleSaveForm() {
		if (meta.length === 0) {
			addMessagePopup({ id: 'zeroLength', type: 'error', message: 'No form elements to save in the form' })
			return
		}

		const checkCondition = (val?: StringBoolean | undefined) => (val && val === 'on' ? true : false)
		const form: Partial<Form> = {
			body: JSON.stringify(
				meta.map((el) => ({
					...el,
					props: {
						...el.props,
						...(el.props.required ? { required: checkCondition(el.props.required) } : {}),
					},
				})),
			),
			title: rootProps.title,
			cancelText: rootProps.cancelText,
			submitText: rootProps.submitText,
			description: rootProps.description,
			allowAnonymousResponse: checkCondition(rootProps.allowAnonymousResponse),
			active: false,
			sendResponseEmail: checkCondition(rootProps.sendResponseEmail),
			allowMultipleResponse: checkCondition(rootProps.allowMultipleResponse),
			allowResponseUpdate: checkCondition(rootProps.allowResponseUpdate),
		}
		saveForm(form)
	}

	return (
		<div className="mb-2 flex w-full items-center justify-between rounded-md border border-gray-200 bg-gray-100 px-3 py-2 shadow-sm">
			<Button
				size="small"
				variant="simple"
				disabled={isPending}
				onClick={() => changeViewType()}
				label={viewType === 'build' ? 'Show Preview' : 'Designer View'}
			/>

			<div className="flex items-center gap-4">
				<Button size="small" label="Save form" disabled={isPending} onClick={handleSaveForm} />
				<Tooltip
					label={
						<ul className="block list-disc pl-4">
							<li className="list-item">Double click on any element to select</li>
							<li className="list-item">Click on the elements in the left panel to add to form</li>
							<li className="list-item">Drag elements to re-order</li>
							<li className="list-item">Set Extra properties for elements in the right panel</li>
							<li className="list-item">
								All the
								<span className="mx-[2px] rounded-md bg-gray-700 px-1 py-[1px] text-white">className</span>
								props mean tailwind classes
							</li>
						</ul>
					}
				>
					<InformationCircleIcon className="h-8 w-8" />
				</Tooltip>
			</div>
		</div>
	)
}

export default FormDesignerTopBar
