'use client';

import { Input, InputProps } from './input';
import { useEffect, useState } from 'react';

function validateDateTime(dateStr: string) {
	const date = new Date(dateStr);
	return date instanceof Date && !isNaN(date.getTime());
}

export type DatePickerProps = Omit<InputProps, 'type'> & { type: 'date' | 'datetime-local' | 'time' };
export function DatePicker({ ...props }: DatePickerProps) {
	const [value, setValue] = useState('');

	useEffect(() => {
		if (props.value && !validateDateTime(props.value as string)) {
			setValue('');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <Input type={props.type} {...props} />;
}
