import { FC } from 'react'
import {
	ChartBarIcon,
	ArrowPathIcon,
	ListBulletIcon,
	DeviceTabletIcon,
	ClipboardDocumentIcon,
	AdjustmentsHorizontalIcon,
	PresentationChartLineIcon,
	AtSymbolIcon,
	ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from '@tanstack/react-router'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

export type Route = {
	name: string
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
		icon: ClipboardDocumentIcon,
		description: 'Create, publish, and get analytics for your forms',
		routes: [
			{ name: 'Designer', icon: DeviceTabletIcon, link: '/apps/forms/designer' },
			{ name: 'All Forms', icon: ListBulletIcon, link: '/apps/forms/' },
		],
	},
	{
		name: 'Automations',
		icon: ArrowPathIcon,
		description: 'Automate your daily processes',
		routes: [
			{ name: 'Designer', icon: AdjustmentsHorizontalIcon, link: '/apps/flows/designer' },
			{ name: 'All Automations', icon: ListBulletIcon, link: '/apps/automations/' },
		],
	},
	{
		name: 'Dashboards',
		icon: PresentationChartLineIcon,
		description: 'Create and manage your dashboards',
		routes: [
			{ name: 'Designer', icon: ChartBarIcon, link: '/apps/dashboards/designer' },
			{ name: 'All Dashboards', icon: ListBulletIcon, link: '/apps/dashboards/' },
		],
	},
	{
		name: 'Communications',
		icon: ChatBubbleLeftRightIcon,
		description: 'Handle your communications from here',
		routes: [
			{ name: 'Email Templates', icon: AtSymbolIcon, link: '/apps/communications/emails/' },
			// { name: 'Schedule Emails', icon: AtSymbolIcon, link: '/apps/communications/emails/designer' },
			{ name: 'Create Email Templates', icon: AtSymbolIcon, link: '/apps/communications/emails/designer' },
		],
	},
	{
		name: 'Projects',
		icon: ClipboardDocumentIcon,
		description: 'Create and manage your projects',
		routes: [{ name: 'All Projects', icon: ListBulletIcon, link: '/apps/projects/' }],
	},
]

function AppsList() {
	const navigate = useNavigate()

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
			<ResponsiveMasonry className="col-span-1 md:col-span-2 lg:col-span-3" columnsCountBreakPoints={{ 300: 1, 1100: 2, 1600: 3 }}>
				<Masonry gutter="1rem" className="mb-4">
					{apps.map((app) => (
						<div key={app.name} className="select-none rounded-lg border-2 border-white p-4 shadow-lg hover:border-primary">
							<div className="mb-2 cursor-pointer hover:text-primary">
								<div className="flex gap-2">
									<app.icon className="h-8 w-8" />

									<div>
										<h3 className="text-xl font-semibold">{app.name}</h3>
										<p className="text-sm text-disabled">{app.description}</p>
									</div>
								</div>
							</div>

							<div className="ml-10 flex flex-col gap-2">
								{app.routes.map((route) => (
									<div key={route.link} className="flex cursor-pointer items-center hover:text-primary" onClick={() => navigate({ to: route.link })}>
										<route.icon className="h-4 w-4" />
										<h4 className="text-md ml-1 font-semibold">{route.name}</h4>
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
