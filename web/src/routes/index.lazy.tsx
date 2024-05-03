import {
  createLazyFileRoute,
  // useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { baseUrl } from '../api/client';
import { useEffect } from 'react';
import { useAuth } from '../contexts/auth';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const { location } = useRouterState();

  useEffect(() => {
    if ((location.search as any).success && (location.search as any).token) {
      localStorage.setItem('token', (location.search as any).token);
      window.location.href = '/'; // handle this better
    }
  }, [location]);

  const { isAuthenticated } = useAuth();

  function login() {
    window.location.href = `${baseUrl}/auth/google?state=${window.location.host}`;
  }

  return (
    <div className='p-2'>
      <h3>Welcome Home!</h3>
      {isAuthenticated ? (
        <h1>You are logged in</h1>
      ) : (
        <button onClick={login}>Login with google</button>
      )}
    </div>
  );
}
