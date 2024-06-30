import { baseUrl } from '../api/client'
import { User } from '../types'
import { atom, useRecoilState } from 'recoil'

export type AuthState = {
	isAuthenticated: boolean
	user: User | null
}

export const authAtom = atom<AuthState>({
	key: 'authAtom',
	default: { isAuthenticated: false, user: null },
})

export async function checkAuth() {
	const res = await fetch(baseUrl + '/auth/user', {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})
	const data = await res.json()
	if (!data.id) return null
	return data
}

export function useAuthState() {
	const [auth, setAuth] = useRecoilState(authAtom)
	return { auth, setAuth }
}

export function useAuth() {
	const [auth, setAuth] = useRecoilState(authAtom)

	function logout() {
		localStorage.removeItem('token')
		setAuth({ isAuthenticated: false, user: null })
		window.location.href = '/auth/login'
	}

	return {
		auth,
		logout,
	}
}
