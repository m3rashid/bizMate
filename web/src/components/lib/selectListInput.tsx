import Button from '@components/lib/button'
import Input from '@components/lib/input'
import Modal from '@components/lib/modal'
import Tooltip from '@components/lib/tooltip'
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { usePopups } from '@hooks/popups'
import { handleViewTransition } from '@utils/helpers'
import { Dispatch, FormEvent, SetStateAction, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

function AddEditModal(props: {
	open: boolean
	onSubmit: (newOption: string, prevOption?: string) => void
	setOpen: Dispatch<SetStateAction<boolean>>
	editData?: string
}) {
	const { t } = useTranslation()
	const { addMessagePopup } = usePopups()

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.stopPropagation()
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (!formData.value) {
			addMessagePopup({ id: 'emptyField', message: 'Option Value missing', type: 'error' })
			return
		}
		props.onSubmit(formData.value, props.editData)
	}

	return (
		<Modal open={props.open} setOpen={props.setOpen} title={!!props.editData ? t('Update option') : t('Add Option')}>
			<form className="flex h-full flex-col gap-4 p-4" onSubmit={handleSubmit}>
				<Input name="value" label="Value" required defaultValue={props.editData ?? ''} />

				<div className="flex flex-grow-0 items-center justify-between pt-3">
					<Button variant="simple" type="reset">
						{t('Reset')}
					</Button>
					<Button type="submit" label={!!props.editData ? 'Update option' : 'Add Option'} />
				</div>
			</form>
		</Modal>
	)
}

function SingleOption(props: { option: string; onRemove: () => void; onEdit: () => void }) {
	const [mouseOver, setMouseOver] = useState(false)
	const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({ id: props.option })

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			onMouseEnter={() => setMouseOver(true)}
			onMouseLeave={() => setMouseOver(false)}
			className={twMerge(
				'relative h-min rounded-lg border-2 border-borderColor bg-white px-2 py-1.5 hover:border-primary',
				isDragging ? 'cursor-grab' : '',
			)}
			style={{ transition, transform: CSS.Transform.toString(transform), viewTransitionName: `form-wrapper-${props.option}` }}
		>
			{mouseOver ? (
				<div className="absolute -right-0 -top-4 flex gap-1">
					<Tooltip label="Edit this option">
						<PencilIcon
							onClick={props.onEdit}
							className="h-8 w-8 cursor-pointer rounded-full bg-disabledLight p-2 shadow-md hover:bg-primary hover:text-white"
						/>
					</Tooltip>

					<Tooltip label="Remove this option" position="left">
						<XMarkIcon
							onClick={props.onRemove}
							className=" h-8 w-8 cursor-pointer rounded-full bg-disabledLight p-2 shadow-md hover:bg-danger hover:text-white"
						/>
					</Tooltip>
				</div>
			) : null}

			{props.option}
		</div>
	)
}

export type SelectListInputProps = {
	name?: string
	required?: boolean
}

function SelectListInput(props: SelectListInputProps) {
	const { t } = useTranslation()
	const { addMessagePopup } = usePopups()
	const [open, setOpen] = useState(false)
	const [options, setOptions] = useState<string[]>([])
	const [editData, setEditData] = useState<string | undefined>(undefined)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const validateOptions = useCallback((opts: string[]) => {
		if (opts.length !== 0) {
			if (opts[opts.length - 1] === '') {
				addMessagePopup({ id: 'lastValueEmpty', message: 'Select option cannot have empty values', type: 'error' })
				return false
			}

			const optionsValues = new Set()
			for (let i = 0; i < opts.length; i++) optionsValues.add(opts[i])
			if (optionsValues.size !== opts.length) {
				addMessagePopup({ id: 'optionValuesNotUnique', message: 'Option values need to be unique', type: 'error' })
				return false
			}
		}

		return true
	}, [])

	function onRemove(option: string) {
		handleViewTransition(() => {
			setOptions((prev) => prev.filter((opt) => opt !== option))
		})
	}

	function onSubmit(newOption: string, previousOption?: string) {
		setOptions((prev) => {
			const newOptionsAll: string[] = !!previousOption
				? prev.reduce((acc, curr) => [...acc, curr === previousOption ? newOption : curr], [] as string[])
				: [...prev, newOption]
			const isValid = validateOptions(newOptionsAll)
			if (isValid) {
				setOpen(false)
				return newOptionsAll
			}
			return prev
		})
		setEditData(undefined)
	}

	function handleDragEnd(e: DragEndEvent) {
		if (!e.over || e.active.id === e.over.id) return
		handleViewTransition(() => {
			setOptions((prev) => {
				if (!e.over) return prev
				const sourceIndex = prev.findIndex((el) => el === e.active.id)
				const destinationIndex = prev.findIndex((el) => el === e.over?.id)
				const newOptions = [...prev]
				newOptions.splice(sourceIndex, 1)
				newOptions.splice(destinationIndex, 0, e.active.id as string)
				return newOptions
			})
		})
	}

	return (
		<DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
			<div className="w-full">
				<div className="flex flex-col gap-2">
					<AddEditModal {...{ open, setOpen, onSubmit, editData }} />

					<label className="block text-sm font-medium text-gray-900">{t('Options')}</label>
					<input type="hidden" name={props.name} required={props.required} value={JSON.stringify(options)} />

					<SortableContext items={options}>
						{options.map((option) => (
							<SingleOption
								option={option}
								key={option}
								onEdit={() => {
									setEditData(option)
									setOpen(true)
								}}
								onRemove={() => onRemove(option)}
							/>
						))}
					</SortableContext>

					<Button
						size="small"
						variant="simple"
						LeftIcon={<PlusIcon className="h-4 w-4" />}
						label="Add Option"
						onClick={(e) => {
							e.stopPropagation()
							e.preventDefault()
							setOpen(true)
						}}
					/>
				</div>
			</div>
		</DndContext>
	)
}

export default SelectListInput
