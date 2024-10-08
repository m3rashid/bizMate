import { Props } from '@/components/apps/forms/renderer/types';
import { textTypes } from '@/components/lib/extras';

export const phoneNumberInputProps: Props = {
	name: [true, 'Name of the input element', 'string'],
	label: [true, 'Label of this field', 'string'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
};

export const inputProps: Props = {
	name: [true, 'Name of the input element', 'string'],
	label: [true, 'Label of this field', 'string'],
	type: [true, 'Type of the input field', ['text', 'color', 'email', 'number', 'password', 'tel', 'url']],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
};

export const textAreaInputProps: Props = {
	name: [true, 'Name of the input element', 'string'],
	label: [true, 'Label of this field', 'string'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
};

// export const richTextInputProps: Props = {
// 	name: [true, 'Name of the input element', 'string'],
// 	label: [true, 'Label of this field', 'string'],
// 	required: [false, 'It is required by the user to fill this field', 'boolean'],
// 	descriptionText: [false, 'Describe more about this field', 'string'],
// };

export const selectInputProps: Props = {
	name: [true, 'Name of the input field', 'string'],
	label: [true, 'Label of this field', 'string'],
	shuffle: [false, 'Shuffle the options for each form', 'boolean'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
	options: [false, 'Options for this select field', 'selectOptions'],
};

export const radioInputProps: Props = {
	name: [true, 'Name of the input field', 'string'],
	label: [true, 'Label of this field', 'string'],
	shuffle: [false, 'Shuffle the options for each form', 'boolean'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
	options: [false, 'Options for this select field', 'selectOptions'],
};

export const dateInputProps: Props = {
	name: [true, 'Name of the date field', 'string'],
	label: [true, 'Label of this field', 'string'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
};

// Extra components (Native web to react components mapping)
export const imageProps: Props = {
	src: [true, 'URL of the image you want to show', 'string'],
};

export const linkProps: Props = {
	href: [true, 'Link of the asset you want to open', 'string'],
	text: [true, 'Text you want to show for the link', 'string'],
	target: [false, 'Where should the link open: _blank(new tab), _self(same tab)', ['_blank', '_self']],
};

export const textProps: Props = {
	text: [false, 'Text you want to show', 'string'],
	type: [false, 'Type of heading', textTypes as any],
};

export const codeProps: Props = {
	code: [false, 'Code you want to show', 'textarea'],
};

export const togglerInputProps: Props = {
	name: [true, 'Name of the input element', 'string'],
	label: [true, 'Label of this field', 'string'],
	required: [false, 'It is required by the user to fill this field', 'boolean'],
	descriptionText: [false, 'Describe more about this field', 'string'],
};
