export type ApiGroup = Record<string, [string, string, string[]]>;

export const endpoints: ApiGroup = {
	createForm: ['POST', '/', []],
};
