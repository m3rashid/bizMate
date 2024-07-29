// { queryName: [Method, Path, Query/MutationKeys] }
export type ApiGroup = Record<string, [string, string, string[]]>;

export const endpoints: ApiGroup = {
	createForm: ['POST', '/', []],
};

export const workspaces: ApiGroup = {
	createWorkspace: ['POST', '/auth/workspaces/create', []],
};
