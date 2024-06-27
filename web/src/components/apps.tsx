import { App } from './appsList'
import Tooltip from './lib/tooltip'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'
import { Link } from '@tanstack/react-router'

export function RenderApp(app: App) {
	return (
		<div className="h-min select-none">
			<div className="flex items-center gap-2">
				<h3 className="text-sm font-semibold text-disabled">{app.name}</h3>
				<Tooltip label={app.description} show="right">
					<InformationCircleIcon className="h-4 w-4 text-disabled" />
				</Tooltip>
			</div>

			<div className="mt-1.5 flex flex-col gap-2">
				{app.routes.map((route) => (
					<Link
						viewTransition
						to={route.link}
						key={route.link}
						search={route.search}
						className="group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-primaryLight hover:shadow-md"
					>
						<route.icon className="h-10 w-10 rounded-md bg-skeletonLight p-2 shadow-md group-hover:bg-white" />

						<div className="flex flex-col gap-1.5">
							<h4 className="-mb-1 mt-1 py-0 text-sm font-semibold">{route.name}</h4>
							<div className="-mt-1 text-xs text-disabled">{route.description}</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
