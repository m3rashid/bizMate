import { Link } from '@tanstack/react-router'

import { useAuth } from '../hooks/auth'

export type HeaderProps = {
	//
}

function Header() {
	const { auth: user, logout } = useAuth()

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex gap-2 p-2">
					<Link to="/" className="[&.active]:font-bold">
						Home
					</Link>
					&nbsp;
					<Link to="/about" className="[&.active]:font-bold">
						About
					</Link>
				</div>

				<div className="flex gap-2 p-2">
					{user.isAuthenticated ? (
						<p onClick={logout} className="cursor-pointer [&.active]:font-bold">
							Logout
						</p>
					) : (
						<Link to="/auth/login" className="[&.active]:font-bold">
							Login
						</Link>
					)}
				</div>
			</div>

			<hr />
		</>
	)
}

export default Header
