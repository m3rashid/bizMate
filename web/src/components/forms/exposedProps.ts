export type SupportedValues =
	| 'string'
	| 'textarea'
	| 'number'
	| 'boolean'
	| 'children'
	| Array<string>
export type Props = Record<string, [string, SupportedValues]> // [description, supportedValues]

export const buttonProps: Props = {
	label: ['Text written on the button', 'string'],
	// onClick: ['Function to be called on button click', 'textarea'],
	className: ['Tailwindcss classNames for button', 'string'],
	type: ['HTML type of button', ['button', 'submit']],
	size: ['Size of the button', ['sm', 'md', 'lg']],
	variant: [
		'Variant(presets) of the button',
		['primary', 'danger', 'secondary', 'disabled', 'sucess'],
	],
}

export const phoneNumberInputProps: Props = {
	name: ['Name of the input element', 'string'],
	label: ['Label of this field', 'string'],
	required: ['It is required by the user to fill this field', 'boolean'],
	// errorText: ['', 'string'],
	labelClassName: ['Tailwindcss classNames to style the label', 'string'],
	descriptionText: ['Describe more about this field', 'string'],
}

export const textInputProps: Props = {
	name: ['Name of the input element', 'string'],
	label: ['Label of this field', 'string'],
	required: ['It is required by the user to fill this field', 'boolean'],
	labelClassName: ['Tailwindcss classNames to style the label', 'string'],
	descriptionText: ['Describe more about this field', 'string'],
}

export const textAreaInputProps: Props = {
	name: ['Name of the input element', 'string'],
	label: ['Label of this field', 'string'],
	required: ['It is required by the user to fill this field', 'boolean'],
	labelClassName: ['Tailwindcss classNames to style the label', 'string'],
	descriptionText: ['Describe more about this field', 'string'],
}

// export const selectInputProps: Props = {
// 	label: ["Label of this field", 'string'],
// 	required: ["It is required by the user to fill this field", 'boolean'],
// 	labelClassName: ["Tailwindcss classNames to style the label", 'string'],
// 	descriptionText: ["Describe more about this field", 'string'],
// 	options: ["", ['_string_']],
// }

// Extra components (Native web to react components mapping)
export const paragraphProps: Props = {
	text: ['Paragraph text you want to show', 'textarea'],
	className: ['Tailwindcss classNames to style', 'string'],
}

export const columnProps: Props = {
	className: ['Tailwindcss classNames to style', 'string'],
}

export const imageProps: Props = {
	src: ['URL of the image you want to show', 'string'],
	className: ['Tailwindcss classNames to style the field', 'string'],
}

export const linkProps: Props = {
	href: ['Link of the asset you want to open', 'string'],
	text: ['Text you want to show for the link', 'string'],
	className: ['Tailwindcss classNames to style the field', 'string'],
	target: ['Where should the link open: _blank(new tab), _self(same tab)', ['_blank', '_self']],
}

export const headingProps: Props = {
	text: ['Text you want to show', 'string'],
	className: ['Tailwindcss classNames to style the field', 'string'],
}

export const codeProps: Props = {
	code: ['Code you want to show', 'textarea'],
	className: ['Tailwindcss classNames to style the field', 'string'],
}

export const togglerProps: Props = {
	label: ['Label of this field', 'string'],
	name: ['Name of the input element', 'string'],
	className: ['Tailwindcss classNames to style the field', 'string'],
	required: ['It is required by the user to fill this field', 'boolean'],
	descriptionText: ['Describe more about this field', 'string'],
}
