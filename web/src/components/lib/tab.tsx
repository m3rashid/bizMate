import { ReactNode, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export type Tab = {
	id: string
	label: ReactNode
}

export type TabProps = {
	tabs: Tab[]
}

function Tabs(props: TabProps) {
	const [selectedTab, setSelectedTab] = useState(props.tabs[0].id)

	return (
		<div>
			<div className="sm:hidden">
				<label htmlFor="tabs" className="sr-only">
					Select a tab
				</label>
				{/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
				{/* <select
					id="tabs"
					name="tabs"
					className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
					defaultValue={
						props.tabs.find((tab) => tab.id === selectedTab)?.label || props.tabs[0].label
					}
				>
					{tabs.map((tab) => (
						<option key={tab.name}>{tab.name}</option>
					))}
				</select> */}
			</div>
			<div className="hidden sm:block">
				<nav className="flex space-x-4" aria-label="Tabs">
					{props.tabs.map((tab) => (
						<a
							key={tab.id}
							// href={tab.href}
							className={twMerge(
								tab.id === selectedTab
									? 'bg-indigo-100 text-indigo-700'
									: 'text-gray-500 hover:text-gray-700',
								'rounded-md px-3 py-2 text-sm font-medium',
							)}
							onClick={() => setSelectedTab(tab.id)}
							aria-current={tab.id === selectedTab ? 'page' : undefined}
						>
							{tab.label}
						</a>
					))}
				</nav>
			</div>
		</div>
	)
}

export default Tabs
