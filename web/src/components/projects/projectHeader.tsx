import { useNavigate } from '@tanstack/react-router'

import Button from '../lib/button'
import { Project } from '../../types'

function ProjectHeader(project: Project) {
	const navigate = useNavigate({ from: '/apps/projects/$projectId' })
	// const [type, setType] = useState<ProjectDetailType | null>(null)

	// const { mutate: editProject } = useMutation({
	// 	onSuccess: () => setType(null),
	// 	mutationKey: ['editProject', project.id],
	// 	mutationFn: (data: Partial<Project>) => apiClient(`/projects/${project.id}/update`, { method: 'POST', body: JSON.stringify(data) }),
	// })

	// function handleEditForm(e: FormEvent<HTMLFormElement>) {
	// 	e.preventDefault()
	// 	const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
	// 	if (type) editProject({ [type]: formData[type] })
	// }

	// function handleReset(e: MouseEvent<HTMLButtonElement>) {
	// 	e.preventDefault()
	// }

	if (!project.id) return null
	return (
		<div className="flex flex-col items-center justify-between gap-4 rounded-lg p-2 px-4 shadow-md md:flex-row">
			<h3 className="text-xl font-bold">{project.name}</h3>
			<div className="flex items-center justify-center gap-4">
				<Button size="small" onClick={() => navigate({ to: `/apps/projects/${project.id}/readme` })}>
					Readme
				</Button>
				<Button size="small" onClick={() => navigate({ to: `/apps/projects/${project.id}/guidelines` })}>
					Guidelines
				</Button>
				<Button size="small" onClick={() => navigate({ to: `/apps/projects/${project.id}/docs` })}>
					Documentation
				</Button>
			</div>
		</div>
	)
}

export default ProjectHeader
