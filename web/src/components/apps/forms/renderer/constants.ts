import {
	codeProps,
	linkProps,
	textProps,
	imageProps,
	inputProps,
	dateInputProps,
	radioInputProps,
	selectInputProps,
	togglerInputProps,
	textAreaInputProps,
	phoneNumberInputProps,
} from '@/components/apps/forms/renderer/exposedProps';
import { SupportedWidgetsArray } from '@/components/apps/forms/renderer/types';
import AdjustmentsVerticalIcon from '@heroicons/react/24/outline/AdjustmentsVerticalIcon';
import Bars2Icon from '@heroicons/react/24/outline/Bars2Icon';
import Bars3BottomLeftIcon from '@heroicons/react/24/outline/Bars3BottomLeftIcon';
import Bars3CenterLeftIcon from '@heroicons/react/24/outline/Bars3CenterLeftIcon';
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon';
import CodeBracketIcon from '@heroicons/react/24/outline/CodeBracketIcon';
import LinkIcon from '@heroicons/react/24/outline/LinkIcon';
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon';
import PhotoIcon from '@heroicons/react/24/outline/PhotoIcon';

export const supportedWidgets: SupportedWidgetsArray = [
	{ name: 'text', props: textProps, label: 'Text', icon: Bars3BottomLeftIcon },
	{ name: 'togglerInput', props: togglerInputProps, label: 'Toggle Input', icon: AdjustmentsVerticalIcon },
	{ name: 'dateInput', props: dateInputProps, label: 'Date Input', icon: CalendarDaysIcon },
	{ name: 'input', props: inputProps, label: 'Text Input', icon: Bars2Icon },
	{ name: 'textareaInput', props: textAreaInputProps, label: 'Text Area Input', icon: Bars3CenterLeftIcon },
	{ name: 'phoneNumberInput', props: phoneNumberInputProps, label: 'Phone No. Input', icon: PhoneIcon },
	{ name: 'image', props: imageProps, label: 'Image', icon: PhotoIcon },
	{ name: 'link', props: linkProps, label: 'Link', icon: LinkIcon },
	{ name: 'code', props: codeProps, label: 'Code', icon: CodeBracketIcon },
	{ name: 'singleSelectInput', props: selectInputProps, label: 'Single Select Input', icon: Bars2Icon },
	{ name: 'radioInput', props: radioInputProps, label: 'Radio Input', icon: Bars2Icon },
];
