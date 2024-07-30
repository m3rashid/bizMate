'use client';

import { apiClient } from '@/api/config';
import { usePopups } from '@/hooks/popups';
import { useRouter } from 'next/navigation';

export function Logout(props: { handleClick: any }) {
	const router = useRouter();
	const { addMessagePopup } = usePopups();

	async function handleLogout() {
		try {
			await apiClient('/auth/logout', {});
			await props.handleClick();
			addMessagePopup({ message: 'You have been logged out', type: 'success', id: 'logout-success' });
		} catch (err: any) {
			addMessagePopup({ message: err.message, type: 'error', id: 'logout-error' });
		}
	}
	return (
		<p onClick={handleLogout} className='m-0 cursor-pointer p-0 [&.active]:font-bold'>
			Logout
		</p>
	);
}
