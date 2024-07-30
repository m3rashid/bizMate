'use client';

import { MessagePopupType, usePopups } from '@/hooks/popups';
import { useLayoutEffect } from 'react';

export function ServerSideMessagePopup(props: MessagePopupType) {
	const { addMessagePopup, removeMessagePopup } = usePopups();

	useLayoutEffect(() => {
		addMessagePopup(props);
		const timeout = setTimeout(() => removeMessagePopup(props.id), 5000);
		return () => clearTimeout(timeout);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
}
