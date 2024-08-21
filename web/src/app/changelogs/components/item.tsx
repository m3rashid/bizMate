import { ChangeLog } from './data';
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';
import { memo } from 'react';

export const ChangelogItem = memo(function ChangelogItem(props: { item: ChangeLog; itemIndex: number }) {
	return (
		<div className='w-full min-w-[300px] sm:min-w-[500px] md:min-w-[700px]'>
			<div className='mb-1 flex items-center gap-2'>
				<div className='z-50 rounded-full bg-gray-200 p-2'>
					<ClockIcon className='h-6 w-6 text-yellow-500' />
				</div>

				<div className='flex-col'>
					<h3 className='font-semibold'>{props.item.tldr}</h3>
					<div className='-mt-0.5 text-sm text-gray-500'>{props.item.date}</div>
				</div>
			</div>

			<ul className='mt-2 list-disc'>
				{props.item.changes.map((change, index) => (
					<li className='ml-16 text-gray-700' key={props.item.date + index}>
						{change}
					</li>
				))}
			</ul>
		</div>
	);
});
