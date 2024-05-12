export type UnionOfObject<T> = T[keyof T]

export type ExplicitAndAll<Universe, Partical> = Partical & Exclude<Universe, Partical>

export type ExplicitAndAllObject<Universe, Partical> = Partical & Omit<Universe, Partical>

export type User = {
	id: number
	name: string
	email: string
	phone?: string
	avatar?: string
	createdAt: string
}

export type Form = {
	id: number
	title: string
	description: string
	body: string
	submitText: string
	cancelText: string
	authRequired: boolean
	successPage: string
	failurePage: string
	active: boolean
	previousVersionIDs: string
	createdAt: string
}

export type PaginationResponse<T> = {
	docs: Array<T>
	limit: number
	count: number
	totalDocs: number
	page: number
	hasNextPage: boolean
	hasPreviousPage: boolean
}
