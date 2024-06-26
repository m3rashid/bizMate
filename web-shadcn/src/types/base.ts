export type ID = number

export type PaginationType = {
	limit: number
	count: number
	totalDocs: number
	page: number
	hasNextPage: boolean
	hasPreviousPage: boolean
}

export type PaginationResponse<T> = PaginationType & { docs: Array<T> }

export type BaseModel = {
	id: ID
	deleted?: boolean
	createdAt: string
}

export type CreatedBy = {
	createdById?: ID
	createdByUser?: User
}

export type UpdatedBy = {
	updatedById?: ID
	updatedByUser?: User
}

export type User = BaseModel & {
	name: string
	email: string
	phone?: string
	avatar?: string
}
