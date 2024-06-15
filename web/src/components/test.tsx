import { twMerge } from 'tailwind-merge'
import { Fragment } from 'react'
import TagIcon from '@heroicons/react/20/solid/TagIcon'
import UserCircleIcon from '@heroicons/react/20/solid/UserCircleIcon'
import ChatBubbleLeftEllipsisIcon from '@heroicons/react/20/solid/ChatBubbleLeftEllipsisIcon'

import FeedSequence from './lib/feedSequence'

type Activity = {
	id: number
	type: string
	person: { name: string; href: string }
	imageUrl?: string
	comment?: string
	date: string
	assigned?: { name: string; href: string }
	tags?: { name: string; href: string; color: string }[]
}
const activities: Activity[] = [
	{
		id: 1,
		type: 'comment',
		person: { name: 'Eduardo Benz', href: '#' },
		imageUrl:
			'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
		comment:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ',
		date: '6d ago',
	},
	{
		id: 2,
		type: 'assignment',
		person: { name: 'Hilary Mahy', href: '#' },
		assigned: { name: 'Kristin Watson', href: '#' },
		date: '2d ago',
	},
	{
		id: 3,
		type: 'tags',
		person: { name: 'Hilary Mahy', href: '#' },
		tags: [
			{ name: 'Bug', href: '#', color: 'fill-red-500' },
			{ name: 'Accessibility', href: '#', color: 'fill-indigo-500' },
		],
		date: '6h ago',
	},
	{
		id: 4,
		type: 'comment',
		person: { name: 'Jason Meyers', href: '#' },
		imageUrl:
			'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
		comment:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.',
		date: '2h ago',
	},
]

function Render({ item: activityItem }: { item: Activity; itemIndex: number }) {
	return (
		<div className="relative flex items-start space-x-3">
			{activityItem.type === 'comment' ? (
				<>
					<div className="relative">
						<img
							className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
							src={activityItem.imageUrl}
							alt=""
						/>

						<span className="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
							<ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
						</span>
					</div>
					<div className="min-w-0 flex-1">
						<div>
							<div className="text-sm">
								<a href={activityItem.person.href} className="font-medium text-gray-900">
									{activityItem.person.name}
								</a>
							</div>
							<p className="mt-0.5 text-sm text-gray-500">Commented {activityItem.date}</p>
						</div>
						<div className="mt-2 text-sm text-gray-700">
							<p>{activityItem.comment}</p>
						</div>
					</div>
				</>
			) : activityItem.type === 'assignment' ? (
				<>
					<div>
						<div className="relative px-1">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
								<UserCircleIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
							</div>
						</div>
					</div>
					<div className="min-w-0 flex-1 py-1.5">
						<div className="text-sm text-gray-500">
							<a href={activityItem.person.href} className="font-medium text-gray-900">
								{activityItem.person.name}
							</a>
							&nbsp; assigned&nbsp;
							<a href={activityItem.assigned?.href} className="font-medium text-gray-900">
								{activityItem.assigned?.name}
							</a>
							&nbsp;
							<span className="whitespace-nowrap">{activityItem.date}</span>
						</div>
					</div>
				</>
			) : activityItem.type === 'tags' ? (
				<>
					<div>
						<div className="relative px-1">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
								<TagIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
							</div>
						</div>
					</div>
					<div className="min-w-0 flex-1 py-0">
						<div className="text-sm leading-8 text-gray-500">
							<span className="mr-0.5">
								<a href={activityItem.person.href} className="font-medium text-gray-900">
									{activityItem.person.name}
								</a>
								&nbsp; added tags
							</span>
							&nbsp;
							<span className="mr-0.5">
								{activityItem.tags?.map((tag) => (
									<Fragment key={tag.name}>
										<a
											href={tag.href}
											className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200"
										>
											<svg className={twMerge(tag.color, 'h-1.5 w-1.5')} viewBox="0 0 6 6" aria-hidden="true">
												<circle cx={3} cy={3} r={3} />
											</svg>
											{tag.name}
										</a>
										&nbsp;
									</Fragment>
								))}
							</span>
							<span className="whitespace-nowrap">{activityItem.date}</span>
						</div>
					</div>
				</>
			) : null}
		</div>
	)
}

function Demo() {
	return (
		<div className="max-w-sm">
			<FeedSequence<Activity> items={activities} itemRender={Render} />
		</div>
	)
}

export default Demo
