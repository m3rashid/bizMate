'use client';

import { Roles } from './roles';
import { Users } from './users';
import { WorkspaceInviteSettings } from './workspaceInviteSettings';
import { Tab, Tabs } from '@/components/lib/tabs';
import { useSearchParamsState } from '@/hooks/helpers';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function HrTabs(props: { currentUserId: string; workspaceId: string }) {
	const params = useSearchParams();

	const tabList: Tab<any>[] = useMemo(
		() => [
			{
				id: 'users',
				label: 'Users',
				Component: Users,
				componentProps: { workspaceId: props.workspaceId },
			},
			{
				id: 'roles',
				label: 'Roles',
				Component: Roles,
				componentProps: { workspaceId: props.workspaceId },
			},
			{
				id: 'invitations',
				label: 'Workspace Invitations',
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
