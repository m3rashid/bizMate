import { FC } from 'react'
import {
	ChartBarIcon,
	ArrowPathIcon,
	ListBulletIcon,
	DeviceTabletIcon,
	ClipboardDocumentIcon,
	AdjustmentsHorizontalIcon,
	PresentationChartLineIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from '@tanstack/react-router'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

export type Route = {
	name: string
	description: string
	icon: FC<any>
	link: string
}

export type App = {
	name: string
	icon: FC<any>
	description: string
	routes: Route[]
}

export const apps: Array<App> = [
	{
		name: 'Forms',
		description: 'Create, publish, and get analytics for your forms',
		icon: ClipboardDocumentIcon,
		routes: [
			{ name: 'Designer', description: 'Design your custom forms', icon: DeviceTabletIcon, link: '/apps/forms/designer' },
			{ name: 'All Forms', description: 'Check all your forms', icon: ListBulletIcon, link: '/apps/forms/' },
		],
	},
	{
		name: 'Automations',
		description: 'Automate your daily processes',
		icon: ArrowPathIcon,
		routes: [
			{ name: 'Designer', description: 'Create your custom workflow', icon: AdjustmentsHorizontalIcon, link: '/apps/flows/designer' },
			{ name: 'All Automations', description: 'Check all your workflows', icon: ListBulletIcon, link: '/apps/flows/' },
		],
	},
	{
		name: 'Dashboards',
		description: 'Create and manage your dashboards',
		icon: PresentationChartLineIcon,
		routes: [
			{ name: 'Designer', description: 'Create your custom dashboards', icon: ChartBarIcon, link: '/apps/dashboards/designer' },
			{ name: 'All Dashboards', description: 'Check all your dashboards', icon: ListBulletIcon, link: '/apps/dashboards/' },
		],
	},
]

function AppsList() {
	const navigate = useNavigate()

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
			<ResponsiveMasonry className="col-span-1 md:col-span-2 lg:col-span-3" columnsCountBreakPoints={{ 300: 1, 1100: 2, 1600: 3 }}>
				<Masonry gutter="1rem" className="mb-4">
					{apps.map((app) => (
						<div className="select-none rounded-lg border-2 border-white p-4 shadow-lg hover:border-primary">
							<div className="mb-2 cursor-pointer hover:text-primary">
								<div className="flex gap-2">
									<app.icon className="h-8 w-8" />

									<div>
										<h3 className="text-xl font-semibold">{app.name}</h3>
										<p className="text-sm text-disabled">{app.description}</p>
									</div>
								</div>
							</div>

							<div className="ml-12 flex flex-col gap-2">
								{app.routes.map((route) => (
									<div key={route.name} className="flex cursor-pointer hover:text-primary" onClick={() => navigate({ to: route.link })}>
										<route.icon className="h-6 w-6" />

										<div className="ml-2">
											<h4 className="text-md font-semibold">{route.name}</h4>
											<p className="text-sm text-disabled">{route.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</Masonry>
			</ResponsiveMasonry>

			<div className="">Other Links</div>
		</div>
	)
}

export default AppsList
