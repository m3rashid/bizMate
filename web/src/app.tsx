import { RouterProvider, createRouter } from '@tanstack/react-router';

import ApiProvider from './api/provider';
import { routeTree } from './routeTree.gen';
import { AuthContext, AuthProvider, defaultAuthContext } from './contexts/auth';
import { useEffect, useState } from 'react';
import { baseUrl } from './api/client';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const [auth, setAuth] = useState<AuthContext>(defaultAuthContext);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(baseUrl + '/auth/check', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (!data.token) throw new Error('No token');
        setAuth({ isAuthenticated: true, user: null, setAuth });
      } catch (err: unknown) {
        setAuth({ isAuthenticated: false, user: null, setAuth });
      }
    }
    checkAuth().catch(console.log);
  }, []);

  return (
    <ApiProvider>
      <AuthProvider value={auth}>
        <RouterProvider router={router} />
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;
