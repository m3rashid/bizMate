import { ReactNode } from 'react';

type DescriptionListProps = {
	title?: string;
	description?: string;
	data: Array<{ left: ReactNode; right: ReactNode }>;
};

export function DescriptionList(props: DescriptionListProps) {
	return (
		<div>
			{props.title || props.description ? (
				<div className='px-4 sm:px-0'>
					{props.title ? <h3 className='text-base font-semibold leading-7 text-gray-900'>{props.title}</h3> : null}
					{props.description ? <p className='mt-1 max-w-2xl text-sm leading-6 text-gray-500'>{props.description}</p> : null}
				</div>
			) : null}
			<div className='mt-6 border-t border-gray-100'>
				<dl className='divide-y divide-gray-100'>
					{props.data.map((d, idx) => (
						<div key={idx} className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
							<dt className='text-sm font-medium leading-6 text-gray-900'>{d.left}</dt>
							<dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>{d.right}</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	);
}
