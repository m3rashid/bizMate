import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const tabs = [
	{ name: 'Applied', href: '#', count: '52', current: false },
	{ name: 'Phone Screening', href: '#', count: '6', current: false },
	{ name: 'Interview', href: '#', count: '4', current: true },
	{ name: 'Offer', href: '#', current: false },
	{ name: 'Disqualified', href: '#', current: false },
]

export type Tab = {
	name: string
	title?: ReactNode
}

export type TabsProps = {
	tabs: Array<Tab>
}

function Tabs(props: TabsProps) {
	return (
		<div>
			<div className="sm:hidden">
				{/* <label htmlFor="tabs" className="sr-only">
					Select a tab
				</label>
				<select
					id="tabs"
					name="tabs"
					className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					defaultValue={tabs.find((tab) => tab.current)?.name}
				>
					{props.tabs.map((tab) => (
						<option key={tab.name}>{tab.title ?? tab.name}</option>
					))}
				</select> */}
			</div>
			<div className="hidden sm:block">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8" aria-label="Tabs">
						{tabs.map((tab) => (
							<a
								key={tab.name}
								href="#"
								className={twMerge(
									'flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium',
									tab.current
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
								)}
								aria-current={tab.current ? 'page' : undefined}
							>
								{tab.name}
								{tab.count ? (
									<span
										className={twMerge(
											'ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block',
											tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
										)}
									>
										{tab.count}
									</span>
								) : null}
							</a>
						))}
					</nav>
				</div>
			</div>
		</div>
	)
}

export default Tabs
