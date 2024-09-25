'use client';

import { ActivityTab } from './activity';
import { WorkspaceSettings } from './settings';
import { Tab, Tabs } from '@/components/lib/tabs';
import { useSearchParamsState } from '@/hooks/helpers';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function AdminTabs(props: { currentUserId: string; workspaceId: string }) {
	const params = useSearchParams();

	const tabList: Tab<any>[] = useMemo(
		() => [
			{
				id: 'activity',
				label: 'Workspace Activity',
				Component: ActivityTab,
				componentProps: { workspaceId: props.workspaceId },
			},
			{
				id: 'settings',
				label: 'Workspace Settings',
				Component: WorkspaceSettings,
				componentProps: { workspaceId: props.workspaceId },
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const getInitialTabId = () => {
		const tabId = params.get('tab');
		if (tabId && tabList.find((tab) => tab.id === tabId)) return tabId;
		return tabList[0].id;
	};

	const [currentTab, setCurrentTab] = useSearchParamsState('tab', getInitialTabId());

	return <Tabs tabs={tabList} selectedTab={currentTab} setSelectedTab={setCurrentTab} />;
}
