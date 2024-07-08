import { exportableTables, kpiAggregationType, taskStatuses } from '.'
import { RouteIds } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { routeTree } from 'src/routeTree.gen'

export type UnionOfObject<T> = T[keyof T]

export type ID = string
export type StringBoolean = 'on' | 'off'
export type ExplicitAndAll<Universe, Partical> = Partical & Exclude<Universe, Partical>
export type ExplicitAndAllObject<Partical> = Record<ExplicitAndAll<string, Partical>, any>

export type DbRow = ExplicitAndAllObject<'id'>
export type PageSearchParams = { page: number }
export type Option = { value: string; label: ReactNode }

export type PageRoute = RouteIds<typeof routeTree>

export type ApiResponse<T> = { data: T; message: string; success: boolean }

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

export type KpiAggregationType = (typeof kpiAggregationType)[number]
export type DashboardKpi = BaseModel &
	CreatedBy &
	UpdatedBy & {
		title: string
		description: string
		model: string
		modelField: string
		aggregationType: KpiAggregationType
		TimePeriod: number // days
	}

export type DashboardChart = BaseModel &
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
		active: boolean
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

export type WebUiNotification = BaseModel & {
	title: string
	description: string
	link: string
	scope: string
	read: boolean
}

export type EmailTemplate = BaseModel &
	CreatedBy &
	UpdatedBy & {
		title: string
		description: string
		variables: string
		subjectTemplate: string
		bodyTemplateHtml: string
		bodyTemplateDesignJson: string
	}

export type BulkEmailRequest = BaseModel &
	CreatedBy & {
		emailTemplateId: number
		emailTemplate: EmailTemplate
		bodyVariableMapping: string
		subjectVariableMapping: string
	}

export type Contact = BaseModel &
	CreatedBy &
	UpdatedBy & {
		name: string
		email: string
		phone: string
		birthday: string
		otherPhones: string
		otherEmails: string
		otherDetails: string
	}

export type Workspace = BaseModel &
	CreatedBy & {
		name: string
		users: User[]
	}

export type Changelog = BaseModel & {}

export type ExportableTable = (typeof exportableTables)[number]
