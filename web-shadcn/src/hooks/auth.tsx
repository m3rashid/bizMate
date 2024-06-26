import { baseUrl } from '@/api/client'
import { User } from '@/types/base'
import { atom } from 'recoil'

export type AuthState = {
	isAuthenticated: boolean
	user: User | null
}

export const authAtom = atom<AuthState>({
	key: 'authKey',
	default: { isAuthenticated: false, user: null },
})

export async function checkAuth() {
	const res = await fetch(baseUrl + '/auth/user', {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})

	if (res.status === 401) {
		return null
	}

	const data = await res.json()
	return data as User
}
