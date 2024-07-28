'use client';

import { getUniqueObjectsByKey } from '@/utils/helpers';
import { ReactNode } from 'react';
import { atom, useRecoilState } from 'recoil';

export type PopupType = 'error' | 'warning' | 'info' | 'success';
type ID = string | number;
export type MessagePopupType = {
	id: ID;
	message: string;
	type: PopupType;
	timeout?: number;
};

const DEFAULT_MESSAGE_POPUP_TIMEOUT = 5000; // 5 seconds

export type ActionPopupType = {
	id: ID;
	type: PopupType;
	title?: string;
	children?: ReactNode;
};

export type PopupState = {
	messagePopups: Array<MessagePopupType>;
	actionPopups: Array<ActionPopupType>;
};

const popupAtom = atom<PopupState>({
	key: 'popupAtom',
	default: { messagePopups: [], actionPopups: [] },
});

export function usePopups() {
	const [{ actionPopups, messagePopups }, setPopups] = useRecoilState(popupAtom);

	function addMessagePopup(messagepopup: MessagePopupType) {
		const found = messagePopups.find((n) => n.id === messagepopup.id);
		if (found) return;

		const timeout = messagepopup.timeout || DEFAULT_MESSAGE_POPUP_TIMEOUT;

		setPopups((prev) => ({
			...prev,
			messagePopups: getUniqueObjectsByKey<MessagePopupType>([...prev.messagePopups, messagepopup], 'id'),
		}));

		setTimeout(() => {
			removeMessagePopup(messagepopup.id);
		}, timeout);
	}

	function removeMessagePopup(id: ID) {
		setPopups((prev) => ({
			...prev,
			messagePopups: prev.messagePopups.filter((n) => n.id !== id),
		}));
	}

	function addActionPopup(popup: ActionPopupType) {
		const found = actionPopups.find((n) => n.id === popup.id);
		if (found) return;

		setPopups((prev) => ({
			...prev,
			actionPopups: getUniqueObjectsByKey<ActionPopupType>([...prev.actionPopups, popup], 'id'),
		}));
	}

	function removeActionPopup(id: ID) {
		setPopups((prev) => ({
			...prev,
			actionPopups: prev.actionPopups.filter((n) => n.id !== id),
		}));
	}

	return {
		actionPopups,
		messagePopups,
		addActionPopup,
		addMessagePopup,
		removeActionPopup,
		removeMessagePopup,
	};
}
