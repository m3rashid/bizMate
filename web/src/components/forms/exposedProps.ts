export type SupportedValues =
	| 'string'
	| 'textarea'
	| 'number'
	| 'boolean'
	| 'children'
	| Array<string>
export type Props = Record<string, SupportedValues>

export const buttonProps: Props = {
	label: 'string',
	onClick: 'textarea',
	className: 'string',
	type: ['button', 'submit'],
	size: ['sm', 'md', 'lg'],
	variant: ['primary', 'danger', 'secondary', 'disabled', 'sucess'],
}

export const phoneNumberInputProps: Props = {
	name: 'string',
	label: 'string',
	required: 'boolean',
	errorText: 'string',
	labelClassName: 'string',
	descriptionText: 'string',
}

export const textInputProps: Props = {
	label: 'string',
	required: 'boolean',
	errorText: 'string',
	labelClassName: 'string',
	descriptionText: 'string',
}

// Extra components (Native web to react components mapping)
export const paragraphProps: Props = {
	value: 'string',
	className: 'string',
}

export const columnProps: Props = {
	className: 'string',
}

export const imageProps: Props = {
	src: 'string',
	className: 'string',
}

export const linkProps: Props = {
	href: 'string',
	text: 'string',
	className: 'string',
	target: ['_blank', '_self'],
}

export const headingProps: Props = {
	text: 'string',
	className: 'string',
}

export const codeProps: Props = {
	code: 'string',
	className: 'string',
}
