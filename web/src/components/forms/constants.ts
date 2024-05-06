import { FC } from 'react'

import { buttonProps, typographyProps, phoneNumberInputProps, textInputProps } from './exposedProps'

type GetProps<T> = Record<keyof T, any>

export type SupportedWidget =
	| { name: 'button'; props: GetProps<typeof buttonProps> }
	| { name: 'textInput'; props: GetProps<typeof textInputProps> }
	| { name: 'phoneNumberInput'; props: GetProps<typeof phoneNumberInputProps> }
	| { name: 'typography'; props: GetProps<typeof typographyProps> }

export type SupportedWidgetName = SupportedWidget['name']

export const widgetMap: Record<
	SupportedWidgetName & Omit<string, SupportedWidgetName>,
	{
		widget: FC
		fieldTransformer?: (field: any) => FC
	}
> = {}

export type FormElementInstance = SupportedWidget & {
	key: string
	children?: FormElementInstance[]
	renderChildren?: any
	render?: (field: any) => FC
}

export type FormRenderProps = {
	meta: FormElementInstance[]
}

export type FormBuilder = FC<FormRenderProps> & {
	register: (widgetName: SupportedWidgetName, widget: any, fieldTransformer?: (field?: any) => any) => void
	useForceUpdate: () => () => void
}
