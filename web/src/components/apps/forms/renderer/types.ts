import {
	codeProps,
	linkProps,
	imageProps,
	inputProps,
	textProps,
	radioInputProps,
	selectInputProps,
	togglerInputProps,
	textAreaInputProps,
	phoneNumberInputProps,
	dateInputProps,
} from '@/components/apps/forms/renderer/exposedProps';
import { Option } from '@/utils/types';
import { FC, PropsWithChildren, SVGProps } from 'react';

type GetProps<T> = Record<keyof T, any>;
export type SupportedWidget =
	| { name: 'input'; props: GetProps<typeof inputProps> }
	| { name: 'textareaInput'; props: GetProps<typeof textAreaInputProps> }
	| { name: 'phoneNumberInput'; props: GetProps<typeof phoneNumberInputProps> }
	| { name: 'image'; props: GetProps<typeof imageProps> }
	| { name: 'link'; props: GetProps<typeof linkProps> }
	| { name: 'text'; props: GetProps<typeof textProps> }
	| { name: 'code'; props: GetProps<typeof codeProps> }
	| { name: 'togglerInput'; props: GetProps<typeof togglerInputProps> }
	| { name: 'singleSelectInput'; props: GetProps<typeof selectInputProps> }
	| { name: 'radioInput'; props: GetProps<typeof radioInputProps> }
	| { name: 'dateInput'; props: GetProps<typeof dateInputProps> }
	// these items are not for showing in left sidebar, just helper components
	| { name: 'selectListInput'; props: any };

export type SupportedWidgetName = SupportedWidget['name'];

export type FormElementType = SupportedWidget & {
	id: string;
	children?: FormElementType[];
	renderChildren?: any;
	render?: (field: any) => FC<PropsWithChildren>;
};

export type FormRenderProps = {
	formBody: FormElementType[];
	className?: string;
};

export type FormBuilder = FC<FormRenderProps> & {
	register: (widgetName: SupportedWidgetName, widget: any, fieldTransformer?: (field?: any) => any) => void;
	useForceUpdate: () => () => void;
};

export type SupportedWidgetsArray = Array<SupportedWidget & { label: string; icon?: FC<SVGProps<SVGSVGElement>> }>;

export type SupportedValues = 'string' | 'textarea' | 'number' | 'boolean' | 'richText' | Array<string | Option> | 'selectOptions' | 'children';
export type Props = Record<string, [boolean, string, SupportedValues]>; // [required, description, supportedValues]
