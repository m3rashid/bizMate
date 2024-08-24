'use client';

import { apiClient } from '../config';
import { getQueryClient } from '../provider';
import { queryKeys } from '../queryKeys';
import { Permission } from '@/hooks/checkPermission';
import { usePopups } from '@/hooks/popups';
import { ApiResponse, Role } from '@/utils/types';
import { PermissionObjectType, PermissionLevel } from '@/utils/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export function useGetUserPermissions() {
	const params = useParams();
	return useQuery({
		queryKey: [queryKeys.permissions],
		queryFn: () => {
			if (params.workspaceId) return apiClient<ApiResponse<Permission[]>>(`/${params.workspaceId}/permissions/all`);
		},
	});
}

export function useGetUserRoles(workspaceId: string, userId: string) {
	return useQuery({
		queryKey: [queryKeys.roles, userId],
		queryFn: () => {
			return apiClient<ApiResponse<Role[]>>(`/${workspaceId}/permissions/user-roles/${userId}/all`);
		},
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});
}

export function useGetUserBarePermissions(workspaceId: string, userId: string) {
	return useQuery({
		queryKey: [queryKeys.barePermissions, userId],
		queryFn: () => {
			return apiClient<ApiResponse<Permission[]>>(`/${workspaceId}/permissions/user-bare-permissions/${userId}/all`);
		},
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});
}

export function useAddBarePermissionToUserMutation(workspaceId: string, userId: string) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.barePermissions, userId],
		mutationFn: (data: { object_type: PermissionObjectType; object_id?: string; level: PermissionLevel }) =>
			apiClient(`/${workspaceId}/permissions/roles/add-bare-permission`, { data: { ...data, user_id: userId } }),
		onSuccess: () => {
			addMessagePopup({ message: 'Permission added successfully', type: 'success', id: 'add-permission' });
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.barePermissions, userId] });
		},
		onError: (error) => {
			addMessagePopup({ message: error.message || 'Could not add permission', type: 'error', id: 'add-permission' });
		},
	});
}

export function useRemovePermissionToUserMutation(workspaceId: string, userId: string) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.barePermissions, userId],
		mutationFn: (data: { object_type: PermissionObjectType; object_id?: string; level: PermissionLevel }) =>
			apiClient(`/${workspaceId}/permissions/roles/remove-bare-permission`, { data: { ...data, user_id: userId } }),
		onSuccess: () => {
			addMessagePopup({ message: 'Permission removed successfully', type: 'success', id: 'remove-permission' + userId });
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.barePermissions, userId] });
		},
		onError: (error) => {
			addMessagePopup({ message: error.message || 'Could not remove permission', type: 'error', id: 'remove-permission' + userId });
		},
	});
}
