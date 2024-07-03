import Button from '@components/lib/button'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/')({
	component: HomeRoute,
	beforeLoad: ({ context }) => {
		if (context.auth.isAuthenticated) throw redirect({ to: '/auth/choose-workspace' })
	},
})

function HomeRoute() {
	const { t } = useTranslation()
	const navigate = useNavigate({ from: '/' })

	return (
		<div className="p-4">
			<Button onClick={() => navigate({ to: '/auth/login' })}>{t('Login')}</Button>
		</div>
	)
}
