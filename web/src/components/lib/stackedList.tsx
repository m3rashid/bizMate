import { FC } from 'react';

export type StackedListProps<T> = {
	data: T[];
	render: FC<{ item: T; index: number }>;
};

export function StackedList<T>(props: StackedListProps<T>) {
	return (
		<ul role='list' className='divide-y divide-gray-100'>
			{props.data.map((data, idx) => (
				<props.render key={idx} item={data} index={idx} />
			))}
		</ul>
	);
}
