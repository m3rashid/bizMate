'use client';

import { apiClient } from '@/api/config';
import { getQueryClient } from '@/api/provider';
import { toast } from 'sonner';

export function Logout(props: { handleClick: any }) {
	async function handleLogout() {
		try {
			const res = await apiClient('/auth/logout');
			if (!res) throw new Error('Failed to logout');
			await props.handleClick();
			getQueryClient().clear();
			toast.success(res.message || 'You have been logged out');
		} catch (err: any) {
			console.log(err);
			toast.error(err.message || 'Failed to logout');
		}
	}

	return (
		<p onClick={handleLogout} className='m-0 cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-100 hover:font-semibold'>
			Logout
		</p>
	);
}
