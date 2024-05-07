import { useCallback, useState } from 'react'

import Button from '../lib/button'
import FormRenderer from './renderer'
import TextInput from '../lib/textInput'
import PhoneNumberInput from '../lib/phoneNumberInput'
import { FormBuilder as FormBuilderType, widgetMap } from './constants'
import { Typography } from '../lib/extras'

const FormBuilder: FormBuilderType = (props) => {
	return <FormRenderer meta={props.meta} />
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
FormBuilder.register('typography', Typography)

export default FormBuilder
