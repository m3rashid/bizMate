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

export type ActionPopupType = {
	id: ID;
	type: PopupType;
	title: string;
} & (
	| { simple: false; children: ReactNode }
	| { simple: true; confirmButtonLabel: string; description: string; onConfirm: () => void; onCancel?: () => void }
);

export type PopupState = {
	messagePopups: Array<MessagePopupType>;
	actionPopups: Array<ActionPopupType>;
};

const popupAtom = atom<PopupState>({
	key: 'popupAtom',
	default: {
		actionPopups: [],
		messagePopups: [],
	},
});

export function usePopups() {
	const [{ actionPopups }, setPopups] = useRecoilState(popupAtom);

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
		addActionPopup,
		removeActionPopup,
	};
}
