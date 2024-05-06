import { Link } from '@tanstack/react-router'

import { useAuth } from '../hooks/auth'

export type HeaderProps = {
	//
}

function Header() {
	const { auth, logout } = useAuth()

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
					<Link to="/apps/forms/builder" className="[&.active]:font-bold">
						Form Builder
					</Link>
				</div>

				<div className="flex gap-2 p-2">
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
			</div>

			<hr />
		</>
	)
}

export default Header
