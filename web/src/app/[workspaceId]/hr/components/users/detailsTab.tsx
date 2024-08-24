'use client';

import { snakeCaseToSentenceCase } from '@/utils/helpers';
import { User } from '@/utils/types';
import dayjs from 'dayjs';

export function UserDetails(props: { workspaceId: string; user: User }) {
	return (
		<table className='border-spacing-x-8'>
			{Object.entries(props.user).map(([key, value]) => {
				if (!value) return null;
				return (
					<tr key={key}>
						<td className='pr-1 font-semibold'>{snakeCaseToSentenceCase(key)}</td>
						<td className='pl-1'>{key === 'created_at' ? dayjs(value as any).format('DD MMM YYYY HH:mm A') : value}</td>
					</tr>
				);
			})}
		</table>
	);
}
