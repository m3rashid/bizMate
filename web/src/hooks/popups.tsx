import { useState, Dispatch, useContext, createContext, SetStateAction, PropsWithChildren, ReactNode } from 'react'

import { getUniqueObjectsByKey } from '../utils/helpers'

export type PopupType = 'error' | 'warning' | 'info' | 'success'
type ID = string | number
export type MessagePopupType = {
	id: ID
	message: string
	type: PopupType
	timeout?: number
}

const DEFAULT_MESSAGE_POPUP_TIMEOUT = 5000 // 5 seconds

export type ActionPopupType = {
	id: ID
	type: PopupType
	title?: string
	children?: ReactNode
}

export type PopupStateType = {
	messagePopups: Array<MessagePopupType>
	actionPopups: Array<ActionPopupType>
}

const defaultPopupContext: PopupStateType = {
	actionPopups: [],
	messagePopups: [],
}

const popupContext = createContext<[popups: PopupStateType, setPopups: Dispatch<SetStateAction<PopupStateType>>]>([defaultPopupContext, () => {}])

export function PopupProvider(props: PropsWithChildren) {
	const [popups, setPopups] = useState<PopupStateType>(defaultPopupContext)
	return <popupContext.Provider value={[popups, setPopups]}>{props.children}</popupContext.Provider>
}

export function usePopups() {
	const [{ actionPopups, messagePopups: messagePopups }, setPopups] = useContext(popupContext)

	function addMessagePopup(messagepopup: MessagePopupType) {
		const found = messagePopups.find((n) => n.id === messagepopup.id)
		if (found) return

		const timeout = messagepopup.timeout || DEFAULT_MESSAGE_POPUP_TIMEOUT

		setPopups((prev) => ({
			...prev,
			messagePopups: getUniqueObjectsByKey<MessagePopupType>([...prev.messagePopups, messagepopup], 'id'),
		}))

		setTimeout(() => {
			removeMessagePopup(messagepopup.id)
		}, timeout)
	}

	function removeMessagePopup(id: ID) {
		setPopups((prev) => ({
			...prev,
			messagePopups: prev.messagePopups.filter((n) => n.id !== id),
		}))
	}

	function addActionPopup(popup: ActionPopupType) {
		const found = actionPopups.find((n) => n.id === popup.id)
		if (found) return

		setPopups((prev) => ({
			...prev,
			actionPopups: getUniqueObjectsByKey<ActionPopupType>([...prev.actionPopups, popup], 'id'),
		}))
	}

	function removeActionPopup(id: ID) {
		setPopups((prev) => ({
			...prev,
			actionPopups: prev.actionPopups.filter((n) => n.id !== id),
		}))
	}

	return {
		actionPopups,
		messagePopups,
		addActionPopup,
		addMessagePopup,
		removeActionPopup,
		removeMessagePopup,
	}
}
