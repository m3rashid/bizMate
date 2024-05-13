export type UnionOfObject<T> = T[keyof T]

export type ExplicitAndAll<Universe, Partical> = Partical & Exclude<Universe, Partical>
export type ExplicitAndAllObject<Universe, Partical> = Partical & Omit<Universe, Partical>

export type StringBoolean = 'on' | 'off'

export type BaseModel = {
	id: number
	deleted?: boolean
	createdAt: string
}

export type CreatedBy = {
	createdById?: number
	createdByUser?: User
}

export type UpdatedBy = {
	updatedById?: number
	updatedByUser?: User
}

export type User = BaseModel & {
	name: string
	email: string
	phone?: string
	avatar?: string
}

export type Form = BaseModel &
	CreatedBy &
	UpdatedBy & {
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

export type FormResponse = BaseModel &
	CreatedBy &
	UpdatedBy & {
		formId: number
		response: string | Record<string, string>
		deviceIp?: string
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
