import { DbRow } from '@mytypes'
import { ReactNode } from 'react'

export type FeedSequenceProps<T> = {
	items: T[]
	itemRender: (props: { item: T; itemIndex: number }) => ReactNode
	endNode?: ReactNode
}

function FeedSequence<T extends DbRow>(props: FeedSequenceProps<T>) {
	return (
		<div className="flow-root">
			<ul role="list" className="-mb-8">
				{props.items.map((activityItem, activityItemIdx) => (
					<li key={activityItem.id}>
						<div className="relative pb-8">
							{!props.endNode && activityItemIdx !== props.items.length - 1 ? (
								<span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
							) : null}
							<props.itemRender {...{ item: activityItem, itemIndex: activityItemIdx }} />
						</div>
					</li>
				))}

				{props.endNode ? (
					<li>
						<div className="relative pb-8">
							<span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
							{props.endNode}
						</div>
					</li>
				) : null}
			</ul>
		</div>
	)
}

export default FeedSequence
