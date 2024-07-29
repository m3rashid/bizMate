import { getSession } from '@/actions/auth';
import { AppDrawer } from '@/components/home/appDrawer';
import { Profile } from '@/components/home/profile';
import { Search } from '@/components/home/search';
import { BrandLogo } from '@/components/lib/brandLogo';
import { pages } from '@/utils/constants';
import { Link } from 'next-view-transitions';

export async function Header(props: { workspaceId?: string }) {
	const session = await getSession();

	return (
		<div className='flex h-12 items-center justify-between border-b-2 px-2 print:hidden'>
			<div className='flex gap-2'>
				{!!props.workspaceId ? <AppDrawer /> : null}
				<Link className='flex cursor-pointer select-none items-center gap-1 hover:text-primary' href='/'>
					<BrandLogo imgClassName='h-8 w-8' />
					<h2 className='m-0 p-0 text-xl font-bold'>Bizmate</h2>
				</Link>
			</div>

			{!!props.workspaceId ? (
				<>
					<Search />
					<div className='flex gap-2'>
						{/* <p onClick={logout} className='m-0 cursor-pointer p-0 [&.active]:font-bold'>Logout</p> */}
						<Link href='/auth/choose-workspace' className='m-0 cursor-pointer p-0 [&.active]:font-bold'>
							Change Workspace
						</Link>

						<Profile user={session.user} />
					</div>
				</>
			) : (
				<div className='flex gap-2'>
					<Link href={pages.about}>About</Link>
					<Link href={pages.changelogs}>Changelogs</Link>
					{session.isAuthenticated ? <Link href={pages.chooseWorkspace}>Goto App</Link> : <Link href={pages.login}>Login</Link>}
				</div>
			)}
		</div>
	);
}
