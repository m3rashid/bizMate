import FormRenderer from '@/components/apps/forms/renderer/renderer';
import { FormBuilder as FormBuilderType, SupportedWidgetName } from '@/components/apps/forms/renderer/types';
import { DatePicker } from '@/components/lib/datePicker';
import { Code, Text, Image, Link } from '@/components/lib/extras';
import { Input } from '@/components/lib/input';
import { PhoneNumberInput } from '@/components/lib/phoneNumberInput';
import { RadioInput } from '@/components/lib/radioInput';
import { SelectListInput } from '@/components/lib/selectListInput';
import { SingleSelectInput } from '@/components/lib/singleSelectInput';
import { TextAreaInput } from '@/components/lib/textAreaInput';
import { TogglerInput } from '@/components/lib/toggle';
import { ExplicitAndAll } from '@/utils/types';
import { FC, useCallback, useState } from 'react';

export const widgetMap: Record<ExplicitAndAll<string, SupportedWidgetName>, { widget: FC<any>; fieldTransformer?: (field: any) => FC }> = {
	togglerInput: { widget: TogglerInput },
	input: { widget: Input },
	textareaInput: { widget: TextAreaInput },
	phoneNumberInput: { widget: PhoneNumberInput as any },
	image: { widget: Image },
	link: { widget: Link },
	code: { widget: Code },
	text: { widget: Text },
	singleSelectInput: { widget: SingleSelectInput },
	selectListInput: { widget: SelectListInput },
	radioInput: { widget: RadioInput },
	dateInput: { widget: DatePicker },
};

const FormBuilder: FormBuilderType = (props) => {
	return (
		<div className={props.className}>
			<FormRenderer formBody={props.formBody} />
		</div>
	);
};

FormBuilder.register = (widgetName, Widget, fieldTransformer) => {
	(widgetMap as any)[widgetName] = {
		widget: (props: any) => <Widget {...props} />,
		fieldTransformer: fieldTransformer || undefined,
	};
};

FormBuilder.useForceUpdate = () => {
	const [, update] = useState<Record<any, any>>();
	const forceUpdate = useCallback(() => update({}), []);
	return forceUpdate;
};

export default FormBuilder;
