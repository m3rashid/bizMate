import { filterBykeys } from '../../utils/helpers'
import { Label, Switch, SwitchGroup, SwitchProps } from '@headlessui/react'
import { ForwardedRef, ReactNode, forwardRef, useImperativeHandle, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export type TogglerProps = SwitchProps & {
	label?: ReactNode
	className?: string
	required?: boolean
	descriptionText?: string
}

function Component(props: TogglerProps, ref: ForwardedRef<{ getValue: () => boolean }>) {
	const [enabled, setEnabled] = useState(props.defaultChecked ?? false)

	useImperativeHandle(ref, () => ({
		getValue: () => enabled,
	}))

	return (
		<div>
			<SwitchGroup as="div" className="flex items-center">
				<Switch
					{...filterBykeys(props, ['label', 'className', 'descriptionText'])}
					checked={enabled}
					onChange={setEnabled}
					className={twMerge(
						'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
						enabled ? 'bg-indigo-600' : 'bg-gray-200',
						props.className,
					)}
				>
					<span
						className={twMerge(
							'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
							enabled ? 'translate-x-5' : 'translate-x-0',
						)}
					/>
				</Switch>

				{props.label ? (
					<Label as="span" className="ml-3 text-sm">
						{props.required ? <span className="text-red-500">*</span> : null}
						{props.label}
					</Label>
				) : null}
			</SwitchGroup>

			{props.descriptionText ? <p className="mt-1 text-sm text-gray-500">{props.descriptionText}</p> : null}
		</div>
	)
}

const TogglerInput = forwardRef(Component)
export default TogglerInput
