import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { App, apps, sideApp } from '@/constants/apps'
import { DoubleArrowRightIcon, DoubleArrowLeftIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { Fragment, PropsWithChildren, useState } from 'react'
import { twMerge } from 'tailwind-merge'

function SidebarApp(props: { app: App; isCollapsed: boolean }) {
	return (
		<div data-collapsed={props.isCollapsed} className="[data-[collapsed=true]]:py-2 group flex flex-col gap-4 py-2">
			<nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
				{!props.isCollapsed ? <span className="ml-1 text-xs text-gray-700">{props.app.name}</span> : null}
				{props.app.routes.map((route) =>
					props.isCollapsed ? (
						<Tooltip key={props.app.name + route.name} delayDuration={0}>
							<TooltipTrigger asChild>
								<Link to={route.link} className="my-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 shadow hover:bg-gray-200">
									<route.icon className="h-4 w-4" />
									<span className="sr-only">{route.name}</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right" className="flex items-center gap-4">
								{`${props.app.name}: ${route.name}`}
							</TooltipContent>
						</Tooltip>
					) : (
						<Link
							to={route.link}
							key={props.app.name + route.name}
							className="my-0.5 flex h-8 items-center justify-start gap-2 rounded-md bg-gray-100 px-3 text-sm shadow hover:bg-gray-200"
						>
							<route.icon className="h-4 w-4" />
							<span>{route.name}</span>
						</Link>
					),
				)}
			</nav>
		</div>
	)
}

export function Sidebar(props: PropsWithChildren<{ defaultCollapsed: boolean }>) {
	const [isCollapsed, setIsCollapsed] = useState(props.defaultCollapsed)

	return (
		<TooltipProvider delayDuration={0}>
			<div className="flex max-h-screen min-h-screen">
				<div
					className={twMerge(
						'h-screen overflow-y-auto border-r border-gray-200 bg-white',
						isCollapsed ? 'no-scrollbar min-w-14 max-w-14' : 'no-scrollbar min-w-48 max-w-56',
					)}
				>
					{apps.map((app) => (
						<Fragment key={app.name}>
							<SidebarApp app={app} isCollapsed={isCollapsed} />
							<Separator />
						</Fragment>
					))}
					<SidebarApp app={sideApp} isCollapsed={isCollapsed} />
				</div>
				<div className="relative">
					<div
						onClick={() => setIsCollapsed((prev) => !prev)}
						className="absolute top-[45vh] cursor-pointer rounded-r-full border-r border-gray-300 bg-gray-50 py-2 pl-0.5 pr-1.5 hover:border-gray-400"
					>
						{isCollapsed ? <DoubleArrowRightIcon /> : <DoubleArrowLeftIcon />}
					</div>
				</div>

				{props.children}
			</div>
		</TooltipProvider>
	)
}
