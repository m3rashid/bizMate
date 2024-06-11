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

export type Project = BaseModel &
	CreatedBy &
	UpdatedBy & {
		name: string
		description: string
		abandoned: boolean
		completed: boolean
		people: Array<User>
		readme: string
		guidelines: string
		docs: string
	}

export type Tag = BaseModel & {
	name: string
}

export const taskStatuses = ['backlog', 'todo', 'inprogress', 'review', 'done'] as const
export type TaskStatus = (typeof taskStatuses)[number]
export type ProjectTask = BaseModel &
	CreatedBy &
	UpdatedBy & {
		title: string
		description: string
		status: TaskStatus
		deadline: Date
		projectId: ID
		project: Project
		users: Array<User>
		tags: Array<Tag>
		parentTaskId?: ID
		parentTask?: ProjectTask
	}

export type ProjectTaskComment = BaseModel &
	CreatedBy &
	UpdatedBy & {
		taskId: ID
		task: ProjectTask
		comment: string
	}

export const exportableTables = ['form_response_table', 'user_table', 'forms_table'] as const
export type ExportableTable = (typeof exportableTables)[number]
