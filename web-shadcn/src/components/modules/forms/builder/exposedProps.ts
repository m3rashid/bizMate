import { Option } from '@/types/others'

export type SupportedValues = 'string' | 'textarea' | 'number' | 'boolean' | 'richText' | Array<string | Option> | 'selectOptions' | 'children'
export type Props = Record<string, [boolean, string, SupportedValues]> // [required, description, supportedValues]

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
