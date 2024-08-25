'use client';

import { apiClient } from '@/api/config';
import { getQueryClient } from '@/api/provider';
import { usePopups } from '@/hooks/popups';

export function Logout(props: { handleClick: any }) {
	const { addMessagePopup } = usePopups();

	async function handleLogout() {
		try {
			await apiClient('/auth/logout', {});
			await props.handleClick();
			getQueryClient().clear();
			addMessagePopup({ message: 'You have been logged out', type: 'success', id: 'logout-success' });
		} catch (err: any) {
			addMessagePopup({ message: err.message, type: 'error', id: 'logout-error' });
		}
	}
	return (
		<p onClick={handleLogout} className='m-0 cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-100 hover:font-semibold'>
			Logout
		</p>
	);
}
