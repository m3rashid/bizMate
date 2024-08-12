import { apiClient } from './config';
import { useMutation } from '@tanstack/react-query';
import { getIronSession } from 'iron-session';

const assetKey = ['workspaces'];

export const useCreateWorkspaceMutation = (token: string) => {
	return useMutation({
		mutationKey: assetKey,
		mutationFn: (data: { name: string; description: string }) =>
			apiClient('/auth/workspaces/create', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
	});
};
