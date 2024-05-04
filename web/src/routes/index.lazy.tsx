import { createLazyFileRoute, useRouterState } from '@tanstack/react-router';
import { baseUrl } from '../api/client';
import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/auth';

const windowTarget = 'bizmateLoginCallback';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const { isAuthenticated, setAuth } = useAuth();
  const { location } = useRouterState();
  const windowObjectReference = useRef<Window | null>(null);
  const previousUrl = useRef<string | null>(null);

  function receiveMessage(event: MessageEvent) {
    const windowBaseUrl = import.meta.env.VITE_APP_BASE_URL;
    if (!windowBaseUrl || event.origin !== windowBaseUrl) {
      // alert: request has been forged
      window.alert('Request has been forged'); // use some ui for alert
      return;
    }

    if (!event.source || (event.source as any).name !== windowTarget) return;
    if (event.data.success && event.data.token) {
      localStorage.setItem('token', event.data.token);
      setAuth((prev) => ({ ...prev, isAuthenticated: true }));
    } else {
      // alert: login failed
      window.alert('Login failed'); // use some ui for alert
    }

    // windowObjectReference.current?.close();
    window.removeEventListener('message', receiveMessage);
  }

  function openSignInWindow(url: string, name: string) {
    window.removeEventListener('message', receiveMessage);
    const strWindowFeatures =
      'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
    if (
      windowObjectReference.current === null ||
      windowObjectReference.current.closed
    ) {
      windowObjectReference.current = window.open(url, name, strWindowFeatures);
    } else if (previousUrl.current !== url) {
      windowObjectReference.current = window.open(url, name, strWindowFeatures);
      windowObjectReference.current?.focus();
    } else {
      windowObjectReference.current.focus();
    }

    window.addEventListener('message', receiveMessage, false);
    previousUrl.current = url;
  }

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(location.search);
      window.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function login() {
    openSignInWindow(
      `${baseUrl}/auth/google?state=${window.location.host}`,
      windowTarget
    );
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
