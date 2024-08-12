'use client';

import { FormView } from './singleFormView';
import { Form } from '@/utils/types';

type PreviewFormProps = {
	form: Form;
};

export function PreviewForm(props: PreviewFormProps) {
	return <FormView type='preview' form={props.form} />;
}
