'use client';

import { Roles } from './roles';
import { Users } from './users';
import { Tab, Tabs } from '@/components/lib/tabs';
import { useSearchParamsState } from '@/hooks/helpers';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function HrTabs(props: { currentUserId: string }) {
	const params = useSearchParams();

	const tabList: Tab<{ currentUserId: string }>[] = useMemo(
		() => [
			{
				id: 'users',
				label: 'Users',
				Component: Users,
				componentProps: { currentUserId: props.currentUserId },
			},
			{
				id: 'roles',
				label: 'Roles',
				Component: Roles,
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
