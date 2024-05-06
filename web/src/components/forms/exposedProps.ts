export type SupportedValues = 'string' | 'textarea' | 'number' | 'boolean' | 'children' | Array<string>
export type Props = Record<string, SupportedValues>

export const buttonProps: Props = {
	onClick: 'textarea',
	className: 'string',
	type: ['button', 'submit'],
	variant: ['primary', 'danger', 'secondary', 'disabled', 'sucess'],
}

export const phoneNumberInputProps: Props = {
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

export const typographyProps: Props = {
	value: 'string',
	className: 'string',
}
