import { widgetMap } from '@components/forms'
import { FormRenderProps } from '@components/forms/constants'
import { Fragment } from 'react'

function FormRenderer(props: FormRenderProps) {
	return (
		<Fragment>
			{props.meta.map((item) => {
				const widgetItem = (widgetMap as any)[item.name]
				if (!widgetItem) return null

				let WidgetField = widgetItem.fieldTransformer ? widgetItem.fieldTransformer(widgetItem) : widgetItem.widget

				if (item.render != undefined) WidgetField = item.render(WidgetField)

				if (item.children && item.children.length > 0) {
					return (
						<WidgetField key={item.id} {...item.props}>
							<FormRenderer meta={item.children} />
						</WidgetField>
					)
				}

				return (
					<WidgetField key={item.id} {...item.props}>
						{item.renderChildren ? item.renderChildren : undefined}
					</WidgetField>
				)
			})}
		</Fragment>
	)
}

export default FormRenderer
