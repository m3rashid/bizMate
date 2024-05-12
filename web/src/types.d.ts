export type UnionOfObject<T> = T[keyof T]

export type ExplicitAndAll<Universe, Partical> = Partical & Exclude<Universe, Partical>
export type ExplicitAndAllObject<Universe, Partical> = Partical & Omit<Universe, Partical>

export type StringBoolean = 'on' | 'off'

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
	successPage: string
	failurePage: string
	previousVersionIDs: string
	createdAt: string
	active: boolean
	allowAnonymousResponse: boolean
	allowResponseUpdate: boolean
	allowMultipleResponse: boolean
	createdById?: number
	updatedById?: number
	createdByUser?: User
	updatedByUser?: User
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
