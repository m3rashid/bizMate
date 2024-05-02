import { lazy } from 'react';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

const TanStackRouterDevtools =
  import.meta.env.MODE === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

export const Route = createRootRoute({
  component: () => (
    <>
      <div className='p-2 flex gap-2'>
        <Link to='/' className='[&.active]:font-bold'>
          Home
        </Link>
        &nbsp;
        <Link to='/about' className='[&.active]:font-bold'>
          About
        </Link>
      </div>
      <hr />
      <Outlet />

      <TanStackRouterDevtools />
    </>
  ),
});
