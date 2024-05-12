import { FC, useCallback, useState } from 'react'

import Button from '../lib/button'
import FormRenderer from './renderer'
import TogglerInput from '../lib/toggle'
import TextInput from '../lib/textInput'
import { ExplicitAndAll } from '../../types'
import TextAreaInput from '../lib/textAreaInput'
import PhoneNumberInput from '../lib/phoneNumberInput'
import { FormBuilder as FormBuilderType, SupportedWidgetName } from './constants'
import { Code, Column, H1, H2, H3, H4, H5, H6, Image, Link, Paragraph } from '../lib/extras'

export const widgetMap: Record<
	ExplicitAndAll<string, SupportedWidgetName>,
	{ widget: FC<any>; fieldTransformer?: (field: any) => FC }
> = {
	button: { widget: Button },
	toggler: { widget: TogglerInput },
	textInput: { widget: TextInput },
	textareaInput: { widget: TextAreaInput },
	phoneNumberInput: { widget: PhoneNumberInput as any },
	paragraph: { widget: Paragraph as any },
	column: { widget: Column },
	image: { widget: Image },
	link: { widget: Link },
	code: { widget: Code },
	h1: { widget: H1 },
	h2: { widget: H2 },
	h3: { widget: H3 },
	h4: { widget: H4 },
	h5: { widget: H5 },
	h6: { widget: H6 },
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
