import { FC } from 'react'

export type StackedListProps<T> = {
	data: T[]
	render: FC<{ item: T; index: number }>
}

function StackedList<T>(props: StackedListProps<T>) {
	return (
		<ul role="list" className="divide-y divide-gray-100">
			{props.data.map((person, index) => (
				<props.render item={person} index={index} />
			))}
		</ul>
	)
}

export default StackedList
