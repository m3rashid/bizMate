import ApiProvider from './api/provider'
import App from './app'
import './index.css'
import './translations'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ApiProvider>
			<App />
		</ApiProvider>
	</StrictMode>,
)
