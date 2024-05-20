export type UnionOfObject<T> = T[keyof T]

export type ID = number
export type StringBoolean = 'on' | 'off'
export type ExplicitAndAll<Universe, Partical> = Partical & Exclude<Universe, Partical>
export type ExplicitAndAllObject<Partical> = Record<ExplicitAndAll<string, Partical>, any>

export type PaginationResponse<T> = {
	docs: Array<T>
	limit: number
	count: number
	totalDocs: number
	page: number
	hasNextPage: boolean
	hasPreviousPage: boolean
}

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
		sendResponseEmail: boolean
		allowAnonymousResponse: boolean
		allowResponseUpdate: boolean
		allowMultipleResponse: boolean
	}

export type FormResponse = BaseModel &
	CreatedBy &
	UpdatedBy & {
		formId: ID
		response: string | Record<string, string>
		deviceIp?: string
	}

export type Kpi = BaseModel &
	CreatedBy &
	UpdatedBy & {
		title: string
		description: string
		model: string
		refreshInterval: number
		pageRoute: string
	}

export type Widget = BaseModel &
	CreatedBy &
	UpdatedBy & {
		dashboardId: ID
		dashboard: Dashboard
		title: string
		description: string
		refreshInterval: number
		position: number
		model: string
		xLabel: string
		yLabel: string
		xDataKey: string
		yDataKey: string
		chartType: string
		chartOptions: string
	}

export type Dashboard = BaseModel &
	CreatedBy &
	UpdatedBy & {
		title: string
		description: string
	}

export type Workflow = BaseModel &
	CreatedBy &
	UpdatedBy & {
		name: string
		description: string
		active: boolean
		startNodeId: ID
		endNodeId: ID
		edges: any // handle this type
	}
