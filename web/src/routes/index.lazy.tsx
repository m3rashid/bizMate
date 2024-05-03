import { createLazyFileRoute } from '@tanstack/react-router';
import { baseUrl } from '../api/client';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  function login() {
    window.location.href = `${baseUrl}/auth/google?state=${window.location.host}`;
  }

  return (
    <div className='p-2'>
      <h3>Welcome Home!</h3>
      <button onClick={login}>Login with google</button>
    </div>
  );
}
