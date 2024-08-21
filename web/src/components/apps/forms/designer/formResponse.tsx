'use client';

import { apiClient } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { parseFormResponses } from '@/components/apps/forms/designer/parseFormResponses';
import { Button } from '@/components/lib/button';
import { PageLoader } from '@/components/lib/loaders';
import { NotFound } from '@/components/lib/notFound';
import { Pagination } from '@/components/lib/pagination';
import { SimpleTable } from '@/components/lib/simpleTable';
import { ApiResponse, Form } from '@/utils/types';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

type FormResponseTableProps = { workspaceId: string; formId: string };
export function FormResponsesTable(props: FormResponseTableProps) {
	const [page, setPage] = useState(1);

	const { data: formRes } = useQuery({
		queryKey: [queryKeys.forms],
		queryFn: () => apiClient<ApiResponse<Form>>(`/${props.workspaceId}/forms/one/${props.formId}`),
	});

	const { data: formResponses, isPending: isFormResponseFetchPending } = useQuery({
		enabled: !!formRes,
		queryKey: [queryKeys.formResponses],
		select: (data) => parseFormResponses(formRes?.data!, data.data),
		queryFn: () => apiClient(`/${props.workspaceId}/forms/response/${props.formId}/all?page=${page}&limit=10`),
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});

	if (isFormResponseFetchPending) return <PageLoader />;
	if (!formRes || !formResponses) return <NotFound />;

	return (
		<>
			<SimpleTable<any>
				rootClassName='w-full'
				description={formRes?.data.description}
				data={formResponses.data?.docs || []}
				columns={formResponses.tableData || []}
				title={`Form Responses (${formRes?.data.title})`}
				tableExportprops={{ mutationKeys: [], formId: props.formId, tableName: 'form_response_table', workspaceId: props.workspaceId }}
				otherActions={
					<Link href={`/${props.workspaceId}/forms/${props.formId}/analytics`}>
						<Button size='small' LeftIcon={<ChartBarIcon className='h-4 w-4' />}>
							Analytics
						</Button>
					</Link>
				}
				emptyState={
					<div className='flex h-72 flex-col items-center justify-center gap-4 rounded-md border-2 border-gray-200'>
						<div className='text-center'>
							<h3 className='text-lg font-semibold text-gray-800'>No responses</h3>
							<p className='text-sm text-gray-500'>Share the form link for your audience</p>
						</div>
					</div>
				}
			/>

			<Pagination
				{...{
					...formResponses.data,
					onNextClick: () => setPage((p) => p + 1),
					onPreviousClick: () => setPage((p) => (p != 1 ? p - 1 : p)),
				}}
			/>
		</>
	);
}
