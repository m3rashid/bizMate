'use client';

import { WorkspaceInviteSettings } from './workspaceInviteSettings';
import { Tab, Tabs } from '@/components/lib/tabs';
import { useSearchParamsState } from '@/hooks/helpers';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function SettingTabs(props: { currentUserId: string }) {
	const params = useSearchParams();
	const tabList: Tab<{ currentUserId: string }>[] = useMemo(
		() => [
			{
				id: 'workspace-invites',
				label: 'Workspace Invites',
				Component: WorkspaceInviteSettings,
				componentProps: { currentUserId: props.currentUserId },
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
