import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './app'
import ApiProvider from './api/provider'
import { AuthProvider } from './hooks/auth'
import { PopupProvider } from './hooks/popups'
import { ActionPopupContainer, MessagePopupContainer } from './components/lib/popups'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ApiProvider>
			<PopupProvider>
				<AuthProvider>
					<App />
					<MessagePopupContainer />
					<ActionPopupContainer />
				</AuthProvider>
			</PopupProvider>
		</ApiProvider>
	</StrictMode>,
)
