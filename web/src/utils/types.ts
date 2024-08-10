import { FormElementType } from '@/components/apps/forms/renderer/types';
import { exportableTables } from '@/utils/constants';
import { ReactNode } from 'react';

export type UnionOfObject<T> = T[keyof T];

export type ID = string;
export type StringBoolean = 'on' | 'off';
export type ExplicitAndAll<Universe, Partical> = Partical & Exclude<Universe, Partical>;
export type ExplicitAndAllObject<Partical> = Record<ExplicitAndAll<string, Partical>, any>;

export type DbRow = ExplicitAndAllObject<'id'>;
export type PageSearchParams = { page: number };
export type Option = { value: string; label: ReactNode };

export type NextjsPageProps<Params = {}, SearchParams = {}> = {
	params: Params;
	searchParams: SearchParams;
};

export type ApiResponse<T> = { data: T; message: string; success: boolean };

export type PaginationType = {
	limit: number;
	count: number;
	totalDocs: number;
	page: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
};

export type PaginationResponse<T> = PaginationType & { docs: Array<T> };

export type BaseModel = {
	id: ID;
	deleted?: boolean;
	created_at: string;
};

export type CreatedBy = {
	created_by_id?: ID;
};

export type WorkspaceScope = {
	workspace_id: string;
};

export type UpdatedBy = {
	updated_by_id?: ID;
};

export type User = BaseModel & {
	name: string;
	email: string;
	phone?: string;
	avatar?: string;
};
export type CookieUser = { userId: string; email: string; avatar: string };

export type Workspace = BaseModel &
	CreatedBy & {
		name: string;
		users: User[];
	};

export type ExportableTable = (typeof exportableTables)[number];

export type Form = BaseModel &
	WorkspaceScope &
	CreatedBy & {
		title: string;
		description: string;
		form_body: FormElementType[];
		active: boolean;
		submit_text: string;
		cancel_text: string;
		send_response_email: boolean;
		allow_anonymous_responses: boolean;
		allow_multiple_responses: boolean;
	};
