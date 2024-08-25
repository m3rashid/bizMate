'use client';

import { apiClient } from '@/api/config';
import { getQueryClient } from '@/api/provider';
import { queryKeys } from '@/api/queryKeys';
import { Permission } from '@/hooks/checkPermission';
import { usePopups } from '@/hooks/popups';
import { ApiResponse, PaginationResponse, Role } from '@/utils/types';
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

export function useGetUserRolesQuery(workspaceId: string, userId: string) {
	return useQuery({
		queryKey: [queryKeys.roles, userId],
		queryFn: () => apiClient<ApiResponse<Role[]>>(`/${workspaceId}/permissions/user-roles/${userId}/all`),
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});
}

export function useGetAllRolesQuery(workspaceId: string) {
	return useQuery({
		queryKey: [queryKeys.roles],
		queryFn: () => apiClient<ApiResponse<PaginationResponse<Role>>>(`/${workspaceId}/permissions/roles/all`),
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});
}

export function useGetUserBarePermissions(workspaceId: string, userId: string) {
	return useQuery({
		queryKey: [queryKeys.barePermissions, userId],
		queryFn: () =>
			apiClient<ApiResponse<Array<Permission & { workspace_id: string }>>>(`/${workspaceId}/permissions/user-bare-permissions/${userId}/all`),
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
			apiClient(`/${workspaceId}/permissions/add-bare-permission`, { method: 'POST', data: { ...data, user_id: userId } }),
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

export function useCreateRoleMutation(workspaceId: string, props: { onSuccess: () => void }) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.roles],
		mutationFn: (data: Role & { workspaceId: string; roleId: string }) =>
			apiClient(`/${workspaceId}/permissions/roles/create`, { method: 'POST', data }),
		onSuccess: () => {
			addMessagePopup({ message: 'Role created successfully', type: 'success', id: 'create-role' });
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.roles] });
			props.onSuccess();
		},
		onError: (error) => {
			addMessagePopup({ message: error.message || 'Could not create role', type: 'error', id: 'create-role' });
		},
	});
}

export function useUpdateRoleMutation(workspaceId: string, props: { onSuccess: () => void }) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.roles],
		mutationFn: (data: Role & { workspaceId: string }) => apiClient(`/${workspaceId}/permissions/roles/update`, { method: 'POST', data }),
		onSuccess: () => {
			addMessagePopup({ message: 'Role updated successfully', type: 'success', id: 'update-role' });
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.roles] });
			props.onSuccess();
		},
		onError: (error) => {
			addMessagePopup({ message: error.message || 'Could not update role', type: 'error', id: 'update-role' });
		},
	});
}

export function useGetRoleByRoleIdQuery(workspace_id: string, role_id: string) {
	return useQuery({
		queryKey: [queryKeys.roles, role_id],
		queryFn: () => apiClient<ApiResponse<Role>>(`/${workspace_id}/permissions/roles/one/${role_id}`),
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});
}

export function useAssignRoleToUserMutation(workspaceId: string, userId: string) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.roles],
		mutationFn: (data: { roleId: string }) => apiClient(`/${workspaceId}/permissions/roles/add-user`, { method: 'POST', data: { ...data, userId } }),
		onSuccess: () => {
			addMessagePopup({ message: 'Role added to user', type: 'success', id: 'update-role' });
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.roles, userId] });
		},
		onError: (error) => {
			addMessagePopup({ message: error.message || 'Could not add role to user', type: 'error', id: 'update-role' });
		},
	});
}

export function useRemoveRoleFromUserMutation(workspaceId: string, userId: string) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.roles],
		mutationFn: (data: { roleId: string }) =>
			apiClient(`/${workspaceId}/permissions/roles/remove-user`, { method: 'POST', data: { ...data, userId } }),
		onSuccess: () => {
			addMessagePopup({ message: 'Role removed from user', type: 'success', id: 'update-role' });
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.roles, userId] });
		},
		onError: (error) => {
			addMessagePopup({ message: error.message || 'Could not remove role from user', type: 'error', id: 'update-role' });
		},
	});
}

export function useRemoveUserFromWorkspace(workspaceId: string, userId: string) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.roles, userId],
		mutationFn: () => apiClient(`/auth/${workspaceId}/remove-user`, { method: 'POST', data: { userId } }),
		onSuccess: () => {
			addMessagePopup({ message: 'User removed from workspace', type: 'success', id: 'update-user' });
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.users] });
		},
		onError: (error) => {
			addMessagePopup({ message: error.message || 'Could not remove user from workspace', type: 'error', id: 'update-user' });
		},
	});
}
