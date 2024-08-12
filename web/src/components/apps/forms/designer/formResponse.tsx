'use client';

import { apiClient } from '@/api/config';
import { parseFormResponses } from '@/components/apps/forms/designer/parseFormResponses';
import { Button } from '@/components/lib/button';
import { PageLoader } from '@/components/lib/loaders';
import { NotFound } from '@/components/lib/notFound';
import { Pagination } from '@/components/lib/pagination';
import { SimpleTable } from '@/components/lib/simpleTable';
import { Form } from '@/utils/types';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

type FormResponseTableProps = { workspaceId: string; form: Form };
export function FormResponsesTable(props: FormResponseTableProps) {
	const [page, setPage] = useState(1);

	const { data: formResponses, isPending: isFormResponseFetchPending } = useQuery({
		queryKey: ['getFormResponses', props.form.id, page, props.workspaceId],
		select: (data) => parseFormResponses(props.form, data.data),
		queryFn: () => apiClient(`/${props.workspaceId}/forms/response/${props.form.id}/all?page=${page}&limit=10`),
		retryOnMount: true,
	});

	if (isFormResponseFetchPending) return <PageLoader />;
	if (!formResponses) return <NotFound />;

	return (
		<>
			<SimpleTable<any>
				rootClassName='w-full'
				description={props.form.description}
				data={formResponses.data?.docs || []}
				columns={formResponses.tableData || []}
				title={`Form Responses (${props.form.title})`}
				tableExportprops={{ mutationKeys: [], formId: props.form.id, tableName: 'form_response_table', workspaceId: props.workspaceId }}
				otherActions={
					<Link href={`/${props.workspaceId}/forms/${props.form.id}/analytics`}>
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
