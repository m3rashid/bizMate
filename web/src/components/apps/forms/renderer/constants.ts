import {
	codeProps,
	linkProps,
	imageProps,
	inputProps,
	headingProps,
	paragraphProps,
	radioInputProps,
	selectInputProps,
	togglerInputProps,
	textAreaInputProps,
	richTextInputProps,
	phoneNumberInputProps,
} from './exposedProps';
import { SupportedWidgetsArray } from './types';
import AdjustmentsVerticalIcon from '@heroicons/react/24/outline/AdjustmentsVerticalIcon';
import Bars2Icon from '@heroicons/react/24/outline/Bars2Icon';
import Bars3CenterLeftIcon from '@heroicons/react/24/outline/Bars3CenterLeftIcon';
import CodeBracketIcon from '@heroicons/react/24/outline/CodeBracketIcon';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import HashtagIcon from '@heroicons/react/24/outline/HashtagIcon';
import LinkIcon from '@heroicons/react/24/outline/LinkIcon';
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon';
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon';
import PhotoIcon from '@heroicons/react/24/outline/PhotoIcon';

export const supportedWidgets: SupportedWidgetsArray = [
	{ name: 'heading', props: headingProps, label: 'Heading', icon: HashtagIcon },
	{ name: 'paragraph', props: paragraphProps, label: 'Paragraph', icon: ListBulletIcon },
	{ name: 'togglerInput', props: togglerInputProps, label: 'Toggle Input', icon: AdjustmentsVerticalIcon },
	{ name: 'input', props: inputProps, label: 'Input', icon: Bars2Icon },
	{ name: 'textareaInput', props: textAreaInputProps, label: 'Text Area Input', icon: Bars3CenterLeftIcon },
	{ name: 'richTextInput', props: richTextInputProps, label: 'Rich Text Input', icon: DocumentTextIcon },
	{ name: 'phoneNumberInput', props: phoneNumberInputProps, label: 'Phone No. Input', icon: PhoneIcon },
	{ name: 'image', props: imageProps, label: 'Image', icon: PhotoIcon },
	{ name: 'link', props: linkProps, label: 'Link', icon: LinkIcon },
	{ name: 'code', props: codeProps, label: 'Code', icon: CodeBracketIcon },
	{ name: 'singleSelectInput', props: selectInputProps, label: 'Single Select Input', icon: Bars2Icon },
	{ name: 'radioInput', props: radioInputProps, label: 'Radio Input', icon: Bars2Icon },
];
