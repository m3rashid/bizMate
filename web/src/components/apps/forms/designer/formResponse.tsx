'use client';

import { useGetFormResponseQuery, useGetSingleFormById } from '@/api/forms/client';
import { Button } from '@/components/lib/button';
import { PageLoader } from '@/components/lib/loaders';
import { UnAuthorizedPage } from '@/components/lib/notFound';
import { Pagination } from '@/components/lib/pagination';
import { SimpleTable } from '@/components/lib/simpleTable';
import { usePermission } from '@/hooks/permission';
import { PERMISSION_READ } from '@/utils/constants';
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon';
import Link from 'next/link';
import { useState } from 'react';

type FormResponseTableProps = { workspaceId: string; formId: string };
export function FormResponsesTable(props: FormResponseTableProps) {
	const { hasPermission } = usePermission();
	const [page, setPage] = useState(1);
	const { data: formRes } = useGetSingleFormById(props.workspaceId, props.formId);
	const { data: formResponses, isPending: isFormResponseFetchPending } = useGetFormResponseQuery(props.workspaceId, props.formId, page, formRes);

	if (!hasPermission('form_responses', PERMISSION_READ) || !formRes || !formResponses) return <UnAuthorizedPage />;
	if (isFormResponseFetchPending) return <PageLoader />;

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
