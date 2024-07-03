import CardList from '@components/lib/cardList'
import Chip from '@components/lib/chip'
import Tooltip from '@components/lib/tooltip'
import PageContainer from '@components/pageContainer'
import AddEditProjectModal from '@components/projects/addEditProject'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import { Project } from '@mytypes'
import { Link, createLazyFileRoute, useParams } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

export const Route = createLazyFileRoute('/$workspaceId/projects/')({
	component: Projects,
})

function ProjectCard(props: Project & { onEdit: () => void; workspaceId: string }) {
	const { t } = useTranslation()
	function handleDeleteProject() {}

	return (
		<div className="h-min select-none rounded-lg border-2 border-white p-2 shadow-lg hover:border-primary sm:p-3 md:p-4">
			<div className="flex justify-between gap-2">
				<div>
					<div className="flex flex-grow gap-2">
						<Link
							to="/$workspaceId/projects/$projectId"
							params={{ projectId: props.id, workspaceId: props.workspaceId }}
							className={twMerge('font-semibold underline', props.abandoned ? 'text-danger' : 'text-success')}
						>
							{props.name}
						</Link>
					</div>

					<div>
						<div className="text-xs text-disabled">
							{t('Created')}: {dayjs(props.createdAt).format('DD MMM, YYYY - HH:mm A')}
						</div>
						<div className="text-sm">{props.description}</div>
					</div>
				</div>

				<div className="">
					<Tooltip label="Edit Form" position="right">
						<PencilSquareIcon onClick={props.onEdit} className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-primaryLight" />
					</Tooltip>
					<Tooltip label="Delete Form" position="right">
						<TrashIcon className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-dangerLight" onClick={handleDeleteProject} />
					</Tooltip>
				</div>
			</div>

			<div className="mt-4 flex w-full flex-wrap gap-2">
				<Tooltip label="Project Guidelines" position="right">
					<Link to="/$workspaceId/projects/$projectId/readme" params={{ projectId: props.id, workspaceId: props.workspaceId }}>
						<Chip variant="simple">{t('Readme')}</Chip>
					</Link>
				</Tooltip>

				<Tooltip label="Project Guidelines" position="right">
					<Link to="/$workspaceId/projects/$projectId/guidelines" params={{ projectId: props.id, workspaceId: props.workspaceId }}>
						<Chip variant="simple">{t('Guidelines')}</Chip>
					</Link>
				</Tooltip>

				<Tooltip label="Project Guidelines" position="right">
					<Link to="/$workspaceId/projects/$projectId/docs" params={{ projectId: props.id, workspaceId: props.workspaceId }}>
						<Chip variant="simple">{t('Docs')}</Chip>
					</Link>
				</Tooltip>
			</div>
		</div>
	)
}

function Projects() {
	const { workspaceId } = useParams({ from: '/$workspaceId/projects/' })
	const [open, setOpen] = useState(false)
	const [editRow, setEditRow] = useState<Project | undefined>(undefined)

	return (
		<PageContainer workspaceId={workspaceId}>
			<AddEditProjectModal {...{ open, setOpen, refetch: () => {}, project: editRow, workspaceId }} />

			<CardList<Project>
				title="Projects"
				workspaceId={workspaceId}
				queryKeys={['getProjects']}
				paginateUrl={`/${workspaceId}/projects/all`}
				defaultEmptyStateName="projects"
				description="Create and manage all projects"
				addButtonProps={{ label: 'New Project', onClick: () => setOpen(true) }}
				cardRenderer={(project) => (
					<ProjectCard
						{...{
							...project,
							workspaceId,
							onEdit: () => {
								setEditRow(project)
								setOpen(true)
							},
						}}
					/>
				)}
			/>
		</PageContainer>
	)
}
