export type UnionOfObject<T> = T[keyof T]

export type User = {
	id: number
	name: string
	email: string
	phone?: string
	avatar?: string
	createdAt: string
}
