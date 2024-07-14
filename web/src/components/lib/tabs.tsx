import { NotFound } from '@components/lib/notFound'
import SingleSelectInput from '@components/lib/singleSelectInput'
import { FC, ReactNode, useState } from 'react'
import { twMerge } from 'tailwind-merge'

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
	const [selectedTab, setSelectedTab] = useState(props.tabs[0]?.id)
	const currentTab = props.tabs.find((tab) => tab.id === selectedTab)

	function SelectRender({ tab }: { tab: Tab }) {
		return (
			<div key={tab.id} className="w-full" onClick={() => setSelectedTab(tab.id)}>
				{tab.label ?? tab.id}
			</div>
		)
	}

	if (props.tabs.length === 0) return null
	return (
		<div className={twMerge('flex flex-col items-center', props.rootClassName)}>
			<div className="mb-4 flex min-w-full items-center justify-center sm:hidden">
				<SingleSelectInput
					className="w-full"
					value={selectedTab}
					default={selectedTab}
					onChange={setSelectedTab}
					options={props.tabs.map((tab) => ({ value: tab.id, label: tab.label || tab.id }))}
					render={({ option }) => {
						return <SelectRender tab={props.tabs.find((tab) => tab.id === option.value) || props.tabs[0]} />
					}}
				/>
			</div>

			<div className={twMerge('mb-4 hidden w-full items-center gap-2 rounded-lg sm:flex', props.tabClassName)}>
				{props.tabs.map((tab) => (
					<div
						key={tab.id}
						className={twMerge(
							'cursor-pointer rounded-full px-2 py-1 text-sm font-medium hover:bg-primaryLight',
							tab.id === selectedTab ? 'bg-primary text-white hover:text-black' : '',
						)}
						onClick={() => setSelectedTab(tab.id)}
					>
						{tab.label ?? tab.id}
					</div>
				))}
			</div>

			<div className="w-full">{selectedTab ? currentTab ? <currentTab.Component {...currentTab.componentProps} /> : <NotFound /> : null}</div>
		</div>
	)
}

export default Tabs
