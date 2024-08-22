'use client';

import { WorkspaceInviteSettings } from './workspaceInviteSettings';
import { Tab, Tabs } from '@/components/lib/tabs';
import { useMemo, useState } from 'react';

export function SettingTabs(props: { currentUserId: string }) {
	const tabList: Tab<{ currentUserId: string }>[] = useMemo(
		() => [
			{
				label: 'Workspace Invites',
				Component: WorkspaceInviteSettings,
				id: 'workspace-invites',
				componentProps: { currentUserId: props.currentUserId },
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const [selectedTab, setSelectedTab] = useState(tabList[0].id);

	return <Tabs tabs={tabList} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />;
}
