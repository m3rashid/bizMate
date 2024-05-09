export type UnionOfObject<T> = T[keyof T]

export type User = {
	id: number
	name: string
	email: string
	phone?: string
	avatar?: string
	createdAt: string
}

export type Form = {
	body: string
	submitText: string
	cancelText: string
	authRequired: boolean
	successPage: string
	failurePage: string
	active: boolean
	previousVersionIDs: string
}
