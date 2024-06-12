import { FC, PropsWithChildren, SVGProps } from 'react'
import LinkIcon from '@heroicons/react/24/outline/LinkIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import PhotoIcon from '@heroicons/react/24/outline/PhotoIcon'
import Bars2Icon from '@heroicons/react/24/outline/Bars2Icon'
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon'
import ViewColumnsIcon from '@heroicons/react/24/outline/ViewColumnsIcon'
import CodeBracketIcon from '@heroicons/react/24/outline/CodeBracketIcon'
import Square2StackIcon from '@heroicons/react/24/outline/Square2StackIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import Bars3CenterLeftIcon from '@heroicons/react/24/outline/Bars3CenterLeftIcon'
import AdjustmentsVerticalIcon from '@heroicons/react/24/outline/AdjustmentsVerticalIcon'

import {
	codeProps,
	linkProps,
	imageProps,
	buttonProps,
	columnProps,
	togglerInputProps,
	headingProps,
	paragraphProps,
	textInputProps,
	textAreaInputProps,
	richTextInputProps,
	phoneNumberInputProps,
} from './exposedProps'

type GetProps<T> = Record<keyof T, any>

export type SupportedWidget =
	| { name: 'button'; props: GetProps<typeof buttonProps> }
	| { name: 'textInput'; props: GetProps<typeof textInputProps> }
	| { name: 'textareaInput'; props: GetProps<typeof textAreaInputProps> }
	| { name: 'phoneNumberInput'; props: GetProps<typeof phoneNumberInputProps> }
	| { name: 'richTextInput'; props: GetProps<typeof richTextInputProps> }
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
	| { name: 'togglerInput'; props: GetProps<typeof togglerInputProps> }

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
	{ name: 'h1', props: headingProps, label: 'Heading 1' },
	{ name: 'h2', props: headingProps, label: 'Heading 2' },
	{ name: 'h3', props: headingProps, label: 'Heading 3' },
	{ name: 'h4', props: headingProps, label: 'Heading 4' },
	{ name: 'h5', props: headingProps, label: 'Heading 5' },
	{ name: 'h6', props: headingProps, label: 'Heading 6' },
	{ name: 'button', props: buttonProps, label: 'Button', icon: Square2StackIcon },
	{ name: 'togglerInput', props: togglerInputProps, label: 'Toggle Input', icon: AdjustmentsVerticalIcon },
	{ name: 'textInput', props: textInputProps, label: 'Text Input', icon: Bars2Icon },
	{ name: 'textareaInput', props: textAreaInputProps, label: 'Text Area Input', icon: Bars3CenterLeftIcon },
	{ name: 'richTextInput', props: richTextInputProps, label: 'Rich Text Input', icon: DocumentTextIcon },
	{ name: 'phoneNumberInput', props: phoneNumberInputProps, label: 'Phone No. Input', icon: PhoneIcon },
	{ name: 'paragraph', props: paragraphProps, label: 'Paragraph', icon: ListBulletIcon },
	{ name: 'column', props: columnProps, label: 'Column', icon: ViewColumnsIcon },
	{ name: 'image', props: imageProps, label: 'Image', icon: PhotoIcon },
	{ name: 'link', props: linkProps, label: 'Link', icon: LinkIcon },
	{ name: 'code', props: codeProps, label: 'Code', icon: CodeBracketIcon },
]
