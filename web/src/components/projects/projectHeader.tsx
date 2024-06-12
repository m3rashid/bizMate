import { FC } from 'react'
import { useNavigate } from '@tanstack/react-router'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import DocumentCheckIcon from '@heroicons/react/24/outline/DocumentCheckIcon'

import { Project } from '../../types'
import Button, { ButtonProps } from '../lib/button'

const buttons: Array<{ label: string; name: string; icon: FC<any>; btnVariant: ButtonProps['variant'] }> = [
	{ name: 'analytics', label: 'Analytics', icon: ChartBarIcon, btnVariant: 'primary' },
	{ name: 'readme', label: 'Readme', icon: DocumentIcon, btnVariant: 'sucess' },
	{ name: 'guidelines', label: 'Guidelines', icon: DocumentCheckIcon, btnVariant: 'danger' },
	{ name: 'docs', label: 'Docs', icon: DocumentTextIcon, btnVariant: 'secondary' },
]

function ProjectHeader(project: Project) {
	const navigate = useNavigate({ from: '/apps/projects/$projectId' })

	if (!project.id) return null
	return (
		<div className="flex flex-col items-center justify-between gap-4 rounded-lg p-2 px-4 shadow-md md:flex-row">
			<h3 className="text-xl font-bold">{project.name}</h3>
			<div className="flex flex-wrap items-center justify-center gap-4">
				{buttons.map((btn) => (
					<Button
						size="small"
						key={btn.name}
						variant={btn.btnVariant}
						LeftIcon={<btn.icon className="h-4 w-4" />}
						onClick={() => navigate({ to: `/apps/projects/${project.id}/${btn.name}` })}
					>
						{btn.label}
					</Button>
				))}
			</div>
		</div>
	)
}

export default ProjectHeader
