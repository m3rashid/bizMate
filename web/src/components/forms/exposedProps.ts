import { Option } from '@mytypes'

export type SupportedValues = 'string' | 'textarea' | 'number' | 'boolean' | 'richText' | Array<string | Option> | 'selectOptions' | 'children'
export type Props = Record<string, [boolean, string, SupportedValues]> // [required, description, supportedValues]

// export const buttonProps: Props = {
// 	label: [true, 'Text written on the button', 'string'],
// 	type: [false, 'HTML type of button', ['button', 'reset']],
// 	size: [false, 'Size of the button', ['sm', 'md', 'lg']],
// 	variant: [false, 'Variant(presets) of the button', ['primary', 'danger', 'secondary', 'disabled', 'sucess']],
// }

export const phoneNumberInputProps: Props = {
	name: [true, 'Name of the input element', 'string'],
	label: [true, 'Label of this field', 'string'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
}

export const inputProps: Props = {
	name: [true, 'Name of the input element', 'string'],
	label: [true, 'Label of this field', 'string'],
	type: [
		true,
		'Type of the input field',
		['text', 'color', 'time', 'datetime-local', 'email', 'month', 'number', 'password', 'tel', 'url', 'week', 'date'],
	],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
}

export const textAreaInputProps: Props = {
	name: [true, 'Name of the input element', 'string'],
	label: [true, 'Label of this field', 'string'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
}

export const richTextInputProps: Props = {
	name: [true, 'Name of the input element', 'string'],
	label: [true, 'Label of this field', 'string'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
}

export const selectInputProps: Props = {
	name: [true, 'Name of the input field', 'string'],
	label: [true, 'Label of this field', 'string'],
	shuffle: [false, 'Shuffle the options for each form', 'boolean'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
	options: [false, 'Options for this select field', 'selectOptions'],
}

export const radioInputProps: Props = {
	name: [true, 'Name of the input field', 'string'],
	label: [true, 'Label of this field', 'string'],
	shuffle: [false, 'Shuffle the options for each form', 'boolean'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
	options: [false, 'Options for this select field', 'selectOptions'],
}

// Extra components (Native web to react components mapping)
export const paragraphProps: Props = {
	text: [false, 'Paragraph text you want to show', 'textarea'],
}

export const imageProps: Props = {
	src: [true, 'URL of the image you want to show', 'string'],
}

export const linkProps: Props = {
	href: [true, 'Link of the asset you want to open', 'string'],
	text: [true, 'Text you want to show for the link', 'string'],
	target: [false, 'Where should the link open: _blank(new tab), _self(same tab)', ['_blank', '_self']],
}

export const headingProps: Props = {
	text: [false, 'Text you want to show', 'string'],
}

export const codeProps: Props = {
	code: [false, 'Code you want to show', 'textarea'],
}

export const togglerInputProps: Props = {
	name: [true, 'Name of the input element', 'string'],
	label: [true, 'Label of this field', 'string'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
}
