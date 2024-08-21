import { getUserFromCookie, logout } from '@/actions/auth';
import { AppDrawer } from '@/components/home/appDrawer';
import { Logout } from '@/components/home/logout';
import { Profile } from '@/components/home/profile';
import { Search } from '@/components/home/search';
import { BrandLogo } from '@/components/lib/brandLogo';
import { Link } from 'next-view-transitions';

export async function Header(props: { workspaceId?: string }) {
	const user = await getUserFromCookie();

	return (
		<div className='flex h-12 items-center justify-between border-b-2 px-2 print:hidden'>
			<div className='flex gap-2'>
				{!!props.workspaceId ? <AppDrawer workspaceId={props.workspaceId} /> : null}
				<Link className='flex cursor-pointer select-none items-center gap-1 hover:text-primary' href='/'>
					<BrandLogo imgClassName='h-8 w-8' />
					<h2 className='m-0 p-0 text-xl font-bold'>Bizmate</h2>
				</Link>
			</div>

			{!!props.workspaceId && user?.userId ? (
				<>
					<Search />
					<div className='flex gap-2'>
						<Logout handleClick={logout} />
						<Link href='/auth/choose-workspace' className='m-0 cursor-pointer p-0 [&.active]:font-bold'>
							Change Workspace
						</Link>

						<Profile user={user} />
					</div>
				</>
			) : (
				<div className='flex gap-2'>
					{user && user.userId ? <Link href='/auth/choose-workspace'>Goto App</Link> : <Link href='/auth/login'>Login</Link>}
				</div>
			)}
		</div>
	);
}
