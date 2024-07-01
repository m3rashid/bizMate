import AppDrawer from '@components/appDrawer'
import BrandLogo from '@components/lib/brandLogo'
import Search from '@components/search'
import { useAuth } from '@hooks/auth'
import { useNavigate } from '@tanstack/react-router'

function Header() {
	const navigate = useNavigate()
	const { logout, auth } = useAuth()

	return (
		<div className="flex h-12 items-center justify-between border-b-2 px-2 print:hidden">
			<div className="flex gap-2">
				<AppDrawer />
				<div className="flex cursor-pointer select-none items-center gap-1 hover:text-primary" onClick={() => navigate({ to: '/' })}>
					<BrandLogo imgClassName="h-8 w-8" />
					<h2 className="m-0 p-0 text-xl font-bold">Bizmate</h2>
				</div>
			</div>

			<Search />

			<div className="flex gap-2">
				<p onClick={logout} className="m-0 cursor-pointer p-0 [&.active]:font-bold">
					Logout
				</p>
				{auth.user?.avatar ? <img className="h-7 w-7 rounded-full" src={auth.user.avatar} /> : null}
			</div>
		</div>
	)
}

export default Header
