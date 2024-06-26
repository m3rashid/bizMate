import ApiProvider from './api/provider.tsx'
import './index.css'
import App from '@/app.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ApiProvider>
			<App />
		</ApiProvider>
	</StrictMode>,
)
