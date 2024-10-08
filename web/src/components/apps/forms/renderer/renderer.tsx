import { widgetMap } from '@/components/apps/forms/renderer';
import { FormRenderProps } from '@/components/apps/forms/renderer/types';
import { Fragment } from 'react';

function FormRenderer(props: FormRenderProps) {
	return (
		<Fragment>
			{props.formBody.map((item) => {
				const widgetItem = (widgetMap as any)[item.name];
				if (!widgetItem) return null;

				let WidgetField = widgetItem.fieldTransformer ? widgetItem.fieldTransformer(widgetItem) : widgetItem.widget;

				if (item.render != undefined) WidgetField = item.render(WidgetField);

				if (item.children && item.children.length > 0) {
					return (
						<WidgetField key={item.id} {...item.props}>
							<FormRenderer formBody={item.children} />
						</WidgetField>
					);
				}

				return (
					<WidgetField key={item.id} {...item.props}>
						{item.renderChildren ? item.renderChildren : undefined}
					</WidgetField>
				);
			})}
		</Fragment>
	);
}

export default FormRenderer;
