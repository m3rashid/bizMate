'use client';

import { NotFound } from '@/components/lib/notFound';
import { SingleSelectInput } from '@/components/lib/singleSelectInput';
import { cn } from '@/utils/helpers';
import { FC, ReactNode, useState } from 'react';

export type Tab<T> = {
	id: string;
	label?: ReactNode;
	Component: FC<any>;
	componentProps?: T;
};

export type TabProps<T> = {
	tabs: Tab<T>[];
	rootClassName?: string;
	tabClassName?: string;
	selectedTab: string;
	setSelectedTab: (tabId: string) => void;
};

export function Tabs<T = any>(props: TabProps<T>) {
	const currentTab = props.tabs.find((tab) => tab?.id === props.selectedTab);

	function SelectRender({ tab }: { tab: Tab<T> }) {
		return (
			<div key={tab.id} className='w-full' onClick={() => props.setSelectedTab(tab.id)}>
				{tab.label ?? tab.id}
			</div>
		);
	}

	if (props.tabs.length === 0) return null;
	return (
		<div className={cn('flex flex-col items-center', props.rootClassName)}>
			<div className='mb-4 flex min-w-full items-center justify-center sm:hidden'>
				<SingleSelectInput
					className='w-full'
					value={props.selectedTab}
					default={props.selectedTab}
					onChange={props.setSelectedTab}
					options={props.tabs.map((tab) => ({ value: tab.id, label: tab.label || tab.id }))}
					render={({ option }) => {
						console.log(option);
						return <SelectRender tab={props.tabs.find((tab) => tab.id === option?.value) || props.tabs[0]} />;
					}}
				/>
			</div>

			<div className={cn('mb-4 hidden w-full items-center gap-2 rounded-lg sm:flex', props.tabClassName)}>
				{props.tabs.map((tab) => (
					<div
						key={tab.id}
						className={cn(
							'cursor-pointer rounded-full px-3 py-1 text-sm font-medium',
							tab.id === props.selectedTab ? 'bg-primary text-white' : 'hover:bg-primaryLight hover:text-black'
						)}
						onClick={() => props.setSelectedTab(tab.id)}
					>
						{tab.label ?? tab.id}
					</div>
				))}
			</div>

			<div className='w-full'>{props.selectedTab ? currentTab ? <currentTab.Component {...currentTab.componentProps} /> : <NotFound /> : null}</div>
		</div>
	);
}
