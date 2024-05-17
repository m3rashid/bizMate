import { Link, useNavigate } from '@tanstack/react-router'

import Search from './search'
import BrandLogo from './lib/brandLogo'
import { useAuth } from '../hooks/auth'

export type HeaderProps = {
	//
}

function Header() {
	const navigate = useNavigate()
	const { auth, logout } = useAuth()

	return (
		<div className="flex h-12 items-center justify-between border-b-2">
			<div className="flex cursor-pointer select-none items-center gap-2 hover:text-primary" onClick={() => navigate({ to: '/' })}>
				<BrandLogo imgClassName="h-7 w-7 ml-2" />
				<h2 className="m-0 p-0 text-lg font-bold">Bizmate</h2>
			</div>

			<Search />

			{auth.isAuthenticated ? (
				<div className="flex gap-2">
					<p onClick={logout} className="m-0 cursor-pointer p-0 [&.active]:font-bold">
						Logout
					</p>
					{auth.user?.avatar ? <img className="h-7 w-7 rounded-full" src={auth.user.avatar} /> : null}
				</div>
			) : (
				<Link to="/auth/login" className="[&.active]:font-bold">
					Login
				</Link>
			)}
		</div>
	)
}

export default Header
