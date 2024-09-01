'use client';

import { apiClient } from '@/api/config';
import { getQueryClient } from '@/api/provider';
import { queryKeys } from '@/api/queryKeys';
import { ApiResponse, PaginationResponse, Role, RolePermission } from '@/utils/types';
import { PermissionObjectType, PermissionLevel } from '@/utils/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export function useGetUserPermissions() {
	const params = useParams();
	return useQuery({
		queryKey: [queryKeys.permissions],
		queryFn: () => {
			if (params.workspaceId) return apiClient<ApiResponse<RolePermission[]>>(`/${params.workspaceId}/permissions/all`);
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
			apiClient<ApiResponse<Array<RolePermission & { workspace_id: string }>>>(`/${workspaceId}/permissions/user-bare-permissions/${userId}/all`),
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});
}

export function useAddBarePermissionToUserMutation(workspaceId: string, userId: string) {
	return useMutation({
		mutationKey: [queryKeys.barePermissions, userId],
		mutationFn: (data: { object_type: PermissionObjectType; object_id?: string; level: PermissionLevel }) =>
			apiClient(`/${workspaceId}/permissions/add-bare-permission`, { method: 'POST', data: { ...data, user_id: userId } }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Permission added successfully');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.barePermissions, userId] });
			} else toast.error('Could not add permission');
		},
	});
}

export function useRemovePermissionToUserMutation(workspaceId: string, userId: string) {
	return useMutation({
		mutationKey: [queryKeys.barePermissions, userId],
		mutationFn: (data: { object_type: PermissionObjectType; object_id?: string; level: PermissionLevel }) =>
			apiClient(`/${workspaceId}/permissions/roles/remove-bare-permission`, { data: { ...data, user_id: userId } }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Permission removed successfully');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.barePermissions, userId] });
			} else toast.error('Could not remove permission');
		},
	});
}

export function useCreateRoleMutation(workspaceId: string, props: { onSuccess: () => void }) {
	return useMutation({
		mutationKey: [queryKeys.roles],
		mutationFn: (data: Role & { workspaceId: string; roleId: string }) =>
			apiClient(`/${workspaceId}/permissions/roles/create`, { method: 'POST', data }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Role created successfully');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.roles] });
				props.onSuccess();
			} else toast.error('Could not create role');
		},
	});
}

export function useUpdateRoleMutation(workspaceId: string, props: { onSuccess: () => void }) {
	return useMutation({
		mutationKey: [queryKeys.roles],
		mutationFn: (data: Role & { workspaceId: string }) => apiClient(`/${workspaceId}/permissions/roles/update`, { method: 'POST', data }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Role updated successfully');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.roles] });
				props.onSuccess();
			} else toast.error('Could not update role');
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
	return useMutation({
		mutationKey: [queryKeys.roles],
		mutationFn: (data: { roleId: string }) => apiClient(`/${workspaceId}/permissions/roles/add-user`, { method: 'POST', data: { ...data, userId } }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Role added to user');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.roles, userId] });
			} else toast.error('Could not add role to user');
		},
	});
}

export function useRemoveRoleFromUserMutation(workspaceId: string, userId: string) {
	return useMutation({
		mutationKey: [queryKeys.roles],
		mutationFn: (data: { roleId: string }) =>
			apiClient(`/${workspaceId}/permissions/roles/remove-user`, { method: 'POST', data: { ...data, userId } }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Role removed from user');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.roles, userId] });
			} else toast.error('Could not remove role from user');
		},
	});
}

export function useRemoveUserFromWorkspace(workspaceId: string, userId: string) {
	return useMutation({
		mutationKey: [queryKeys.roles, userId],
		mutationFn: () => apiClient(`/auth/${workspaceId}/remove-user`, { method: 'POST', data: { userId } }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'User removed from workspace');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.users] });
			} else toast.error('Could not remove user from workspace');
		},
		onError: (error) => {},
	});
}
