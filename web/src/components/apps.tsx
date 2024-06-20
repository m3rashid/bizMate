import { Link } from '@tanstack/react-router'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'

import Tooltip from './lib/tooltip'
import { App, apps, sideApps } from './appsList'

function RenderApp(app: App) {
	return (
		<div className="h-min select-none rounded-lg border-2 border-white p-2 shadow-lg hover:border-primary">
			<div className="flex items-center gap-2">
				<h3 className="font-semibold text-disabled">{app.name}</h3>
				<Tooltip label={app.description} show="right">
					<InformationCircleIcon className="h-5 w-5 text-disabled" />
				</Tooltip>
			</div>

			<div className="mt-3 flex flex-col gap-4">
				{app.routes.map((route) => (
					<Link
						viewTransition
						to={route.link}
						key={route.link}
						search={route.search}
						className="group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-primaryLight hover:shadow-md"
					>
						<route.icon className="h-10 w-10 rounded-md bg-skeletonLight p-2 shadow-md group-hover:bg-white" />

						<div className="text-sm">
							<h4 className="-mb-1 mt-1 py-0 font-semibold">{route.name}</h4>
							<div className="-mt-1 text-disabled">{route.description}</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}

function AppsList() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
			<ResponsiveMasonry className="col-span-1 md:col-span-2 lg:col-span-3" columnsCountBreakPoints={{ 300: 1, 1100: 2, 1600: 3 }}>
				<Masonry gutter="1rem" className="mb-4">
					{apps.map((app) => (
						<RenderApp key={app.name} {...app} />
					))}
				</Masonry>
			</ResponsiveMasonry>

			<div className="flex flex-col gap-4">
				{sideApps.map((app) => (
					<RenderApp key={app.name} {...app} />
				))}
			</div>
		</div>
	)
}

export default AppsList
