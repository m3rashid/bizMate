import { FormBuilder as FormBuilderType, SupportedWidgetName } from '@components/forms/constants'
import FormRenderer from '@components/forms/renderer'
import { Code, H1, H2, H3, H4, H5, H6, Image, Link, Paragraph } from '@components/lib/extras'
import Input from '@components/lib/input'
import PhoneNumberInput from '@components/lib/phoneNumberInput'
import RadioInput from '@components/lib/radioInput'
import RichTextInput from '@components/lib/richTextInput'
import SelectListInput from '@components/lib/selectListInput'
import SingleSelectInput from '@components/lib/singleSelectInput'
import TextAreaInput from '@components/lib/textAreaInput'
import TogglerInput from '@components/lib/toggle'
import { ExplicitAndAll } from '@mytypes'
import { FC, useCallback, useState } from 'react'

export const widgetMap: Record<ExplicitAndAll<string, SupportedWidgetName>, { widget: FC<any>; fieldTransformer?: (field: any) => FC }> = {
	togglerInput: { widget: TogglerInput },
	input: { widget: Input },
	textareaInput: { widget: TextAreaInput },
	richTextInput: { widget: RichTextInput },
	phoneNumberInput: { widget: PhoneNumberInput as any },
	paragraph: { widget: Paragraph as any },
	image: { widget: Image },
	link: { widget: Link },
	code: { widget: Code },
	h1: { widget: H1 },
	h2: { widget: H2 },
	h3: { widget: H3 },
	h4: { widget: H4 },
	h5: { widget: H5 },
	h6: { widget: H6 },
	singleSelectInput: { widget: SingleSelectInput },
	selectListInput: { widget: SelectListInput },
	radioInput: { widget: RadioInput },
}

const FormBuilder: FormBuilderType = (props) => {
	return (
		<div className={props.className}>
			<FormRenderer meta={props.meta} />
		</div>
	)
}

FormBuilder.register = (widgetName, Widget, fieldTransformer) => {
	;(widgetMap as any)[widgetName] = {
		widget: (props: any) => <Widget {...props} />,
		fieldTransformer: fieldTransformer || undefined,
	}
}

FormBuilder.useForceUpdate = () => {
	const [, update] = useState<Record<any, any>>()
	const forceUpdate = useCallback(() => update({}), [])
	return forceUpdate
}

export default FormBuilder
