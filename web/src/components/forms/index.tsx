import { useCallback, useState } from 'react'

import Button from '../lib/button'
import FormRenderer from './renderer'
import TextInput from '../lib/textInput'
import PhoneNumberInput from '../lib/phoneNumberInput'
import { FormBuilder as FormBuilderType, widgetMap } from './constants'
import { Code, Column, H1, H2, H3, H4, H5, H6, Image, Link, Paragraph } from '../lib/extras'

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

FormBuilder.register('button', Button)
FormBuilder.register('textInput', TextInput)
FormBuilder.register('phoneNumberInput', PhoneNumberInput)
FormBuilder.register('paragraph', Paragraph)

FormBuilder.register('column', Column)
FormBuilder.register('image', Image)
FormBuilder.register('link', Link)
FormBuilder.register('code', Code)

FormBuilder.register('h1', H1)
FormBuilder.register('h2', H2)
FormBuilder.register('h3', H3)
FormBuilder.register('h4', H4)
FormBuilder.register('h5', H5)
FormBuilder.register('h6', H6)

export default FormBuilder
