import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './app'
import ApiProvider from './api/provider'
import { AuthProvider } from './hooks/auth'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ApiProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</ApiProvider>
	</StrictMode>,
)
