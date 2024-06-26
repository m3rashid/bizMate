import { inputProps } from './exposedProps'
import { FC, PropsWithChildren, SVGProps } from 'react'

type GetProps<T> = Record<keyof T, any>

export type SupportedWidget = {
	name: 'input'
	props: GetProps<typeof inputProps>
}

export type SupportedWidgetName = SupportedWidget['name']

export type FormElementInstance = SupportedWidget & {
	id: string
	children?: FormElementInstance[]
	renderChildren?: any
	render?: (field: any) => FC<PropsWithChildren>
}

export type FormRenderProps = {
	meta: FormElementInstance[]
	className?: string
}

export type FormBuilder = FC<FormRenderProps> & {
	register: (widgetName: SupportedWidgetName, widget: any, fieldTransformer?: (field?: any) => any) => void
	useForceUpdate: () => () => void
}

export type SupportedWidgetsArray = Array<SupportedWidget & { label: string; icon?: FC<SVGProps<SVGSVGElement>> }>

export const supportedWidgets: SupportedWidgetsArray = [
	{ name: 'input', props: inputProps, label: 'Input' },
	// ...
]
