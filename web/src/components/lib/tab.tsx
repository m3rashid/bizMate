import { twMerge } from 'tailwind-merge'
import { FC, ReactNode, useState } from 'react'

import { NotFound } from './notFound'
import SingleSelectInput from './singleSelectInput'

export type Tab = {
	id: string
	label?: ReactNode
	Component: FC<any>
	componentProps?: any
}

export type TabProps = {
	tabs: Tab[]
	rootClassName?: string
	tabClassName?: string
}

function Tabs(props: TabProps) {
	const [selectedTab, setSelectedTab] = useState(props.tabs[0].id)

	const currentTab = props.tabs.find((tab) => tab.id === selectedTab)

	function SelectRender({ tab }: { tab: Tab }) {
		return (
			<div key={tab.id} className="w-full" onClick={() => setSelectedTab(tab.id)}>
				{tab.label ?? tab.id}
			</div>
		)
	}

	return (
		<div className={twMerge('flex flex-col items-center', props.rootClassName)}>
			<div className="mb-4 flex min-w-full items-center justify-center sm:hidden">
				<SingleSelectInput
					className="w-full"
					value={selectedTab}
					default={selectedTab}
					onChange={setSelectedTab}
					options={props.tabs.map((tab) => ({
						id: tab.id,
						value: tab.id,
						label: tab.label || tab.id,
					}))}
					render={({ option }) => {
						return <SelectRender tab={props.tabs.find((tab) => tab.id === option) || props.tabs[0]} />
					}}
				/>
			</div>
			<div className={twMerge('mb-4 hidden w-full items-center justify-center space-x-4 rounded-lg bg-borderColor p-2 sm:flex', props.tabClassName)}>
				{props.tabs.map((tab) => (
					<div
						key={tab.id}
						className={twMerge(
							'cursor-pointer rounded-md border-2 px-3 py-2 text-sm font-medium hover:border-primaryLight hover:bg-primaryLight',
							tab.id === selectedTab ? ' border-primaryLight bg-primary text-white' : ' hover:text-white',
						)}
						onClick={() => setSelectedTab(tab.id)}
					>
						{tab.label ?? tab.id}
					</div>
				))}
			</div>

			{selectedTab ? currentTab ? <currentTab.Component {...currentTab.componentProps} /> : <NotFound /> : null}
		</div>
	)
}

export default Tabs
