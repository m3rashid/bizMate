import { FC, PropsWithChildren } from 'react'

import {
	codeProps,
	linkProps,
	imageProps,
	buttonProps,
	columnProps,
	togglerProps,
	headingProps,
	paragraphProps,
	textInputProps,
	textAreaInputProps,
	phoneNumberInputProps,
} from './exposedProps'

type GetProps<T> = Record<keyof T, any>

export type SupportedWidget =
	| { name: 'button'; props: GetProps<typeof buttonProps> }
	| { name: 'textInput'; props: GetProps<typeof textInputProps> }
	| { name: 'textareaInput'; props: GetProps<typeof textAreaInputProps> }
	| { name: 'phoneNumberInput'; props: GetProps<typeof phoneNumberInputProps> }
	| { name: 'paragraph'; props: GetProps<typeof paragraphProps> }
	| { name: 'column'; props: GetProps<typeof columnProps> }
	| { name: 'image'; props: GetProps<typeof imageProps> }
	| { name: 'link'; props: GetProps<typeof linkProps> }
	| { name: 'h1'; props: GetProps<typeof headingProps> }
	| { name: 'h2'; props: GetProps<typeof headingProps> }
	| { name: 'h3'; props: GetProps<typeof headingProps> }
	| { name: 'h4'; props: GetProps<typeof headingProps> }
	| { name: 'h5'; props: GetProps<typeof headingProps> }
	| { name: 'h6'; props: GetProps<typeof headingProps> }
	| { name: 'code'; props: GetProps<typeof codeProps> }
	| { name: 'toggler'; props: GetProps<typeof togglerProps> }

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

export type SupportedWidgetsArray = Array<SupportedWidget & { label: string }>
export const supportedWidgets: SupportedWidgetsArray = [
	{ name: 'button', props: buttonProps, label: 'Button' },
	{ name: 'toggler', props: togglerProps, label: 'Toggle Input' },
	{ name: 'textInput', props: textInputProps, label: 'Text Input' },
	{ name: 'textareaInput', props: textAreaInputProps, label: 'Text Area Input' },
	{ name: 'phoneNumberInput', props: phoneNumberInputProps, label: 'Phone Number Input' },
	{ name: 'paragraph', props: paragraphProps, label: 'Paragraph' },
	{ name: 'column', props: columnProps, label: 'Column' },
	{ name: 'image', props: imageProps, label: 'Image' },
	{ name: 'link', props: linkProps, label: 'Link' },
	{ name: 'h1', props: headingProps, label: 'Heading 1' },
	{ name: 'h2', props: headingProps, label: 'Heading 2' },
	{ name: 'h3', props: headingProps, label: 'Heading 3' },
	{ name: 'h4', props: headingProps, label: 'Heading 4' },
	{ name: 'h5', props: headingProps, label: 'Heading 5' },
	{ name: 'h6', props: headingProps, label: 'Heading 6' },
	{ name: 'code', props: codeProps, label: 'Code' },
]
