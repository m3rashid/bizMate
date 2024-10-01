import { getUserFromCookie } from '@/actions/auth';
import { CalendarPossibleQueryParams } from '@/hooks/calendarHelpers';
import { NextjsPageProps } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function CalendarPage(props: NextjsPageProps<{ workspaceId: string }, CalendarPossibleQueryParams>) {
	const user = await getUserFromCookie();

	if (!user) return null;
	return redirect(`/app/${props.params.workspaceId}/calendar/${user.userId}`);
}
