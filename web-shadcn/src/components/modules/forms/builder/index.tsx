import { SupportedWidgetName, FormBuilder as FormBuilderType } from './constants'
import FormRenderer from './renderer'
import { Input } from '@/components/ui/input'
import { ExplicitAndAll } from '@/types/others'
import { FC, useCallback, useState } from 'react'

export const widgetMap: Record<ExplicitAndAll<string, SupportedWidgetName>, { widget: FC<any>; fieldTransformer?: (field: any) => FC }> = {
	input: { widget: Input },
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
