import { getUserFromCookie, logout } from '@/actions/auth';
import { AppDrawer } from '@/components/home/appDrawer';
import { Logout } from '@/components/home/logout';
import { Search } from '@/components/home/search';
import { BrandLogo } from '@/components/lib/brandLogo';
import { PopoverMenu } from '@/components/lib/popoverMenu';
import { Link } from 'next-view-transitions';

export async function Header(props: { workspaceId?: string }) {
	const user = await getUserFromCookie();

	return (
		<div className='flex h-12 items-center justify-between border-b-2 px-2 print:hidden'>
			<div className='flex gap-1'>
				{!!props.workspaceId ? <AppDrawer workspaceId={props.workspaceId} /> : null}
				<Link
					href={props.workspaceId ? `/app/${props.workspaceId}` : '/'}
					className='flex cursor-pointer select-none items-center gap-1 hover:text-primary'
				>
					<BrandLogo imgClassName='h-7 w-7' />
					<h2 className='m-0 hidden p-0 text-xl font-bold sm:block'>Bizmate</h2>
				</Link>
			</div>

			{!!props.workspaceId && !!user ? (
				<>
					<Search />
					<PopoverMenu position='left' trigger='Actions' popoverPanelClassName='min-w-56 p-2'>
						<div className='cursor-not-allowed p-2 text-disabled'>{user.email}</div>
						<Logout handleClick={logout} />
						<Link href='/app' className='m-0 block cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-100 hover:font-semibold'>
							Change Workspace
						</Link>
					</PopoverMenu>
				</>
			) : (
				<div className='flex gap-2'>{user && user.userId ? <Link href='/app'>Goto App</Link> : <Link href='/auth/login'>Login</Link>}</div>
			)}
		</div>
	);
}
