import { baseUrl } from '@api/client'
import { User } from '@mytypes'
import { atom, useRecoilState, useRecoilValue } from 'recoil'

export type AuthState = {
	isAuthenticated: boolean
	user: User | null
}

const defaultAuthState: AuthState = { isAuthenticated: false, user: null }

export const authAtom = atom<AuthState>({
	key: 'authAtom',
	default: defaultAuthState,
})

export async function checkAuth() {
	const res = await fetch(baseUrl + '/auth/user', {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})
	const resJson = await res.json()
	if (!resJson.success) throw new Error('Failed')
	return resJson.data
}

export function useAuthState() {
	const [auth, setAuth] = useRecoilState(authAtom)
	return { auth, setAuth }
}

export const useAuthValue = () => useRecoilValue(authAtom)

export function useAuth() {
	const [auth, setAuth] = useRecoilState(authAtom)

	function logout() {
		localStorage.removeItem('token')
		setAuth(defaultAuthState)
	}

	return {
		auth,
		logout,
	}
}
