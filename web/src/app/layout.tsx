import './globals.css';
import TanstackQueryProvider from '@/api/provider';
import { RecoilProvider } from '@/atoms/provider';
import { PopupContainer } from '@/components/lib/popups';
import { getTailwindColor } from '@/utils/helpers';
import CheckCircleIcon from '@heroicons/react/20/solid/CheckCircleIcon';
import ExclamationTriangleIcon from '@heroicons/react/20/solid/ExclamationTriangleIcon';
import InformationCircleIcon from '@heroicons/react/20/solid/InformationCircleIcon';
import XCircleIcon from '@heroicons/react/20/solid/XCircleIcon';
import XMarkIcon from '@heroicons/react/20/solid/XMarkIcon';
import type { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Bizmate',
	description: 'Bizmate',
};

export default async function RootLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<ViewTransitions>
			<html lang='en'>
				<body className={font.className}>
					<TanstackQueryProvider>
						<NextTopLoader color={getTailwindColor('primary')} />
						<RecoilProvider>
							<Toaster
								duration={5000}
								position='top-center'
								pauseWhenPageIsHidden
								icons={{
									error: <XCircleIcon />,
									info: <InformationCircleIcon />,
									success: <CheckCircleIcon />,
									warning: <ExclamationTriangleIcon />,
								}}
								toastOptions={{
									unstyled: true,
									classNames: {
										error: 'border-red-100 text-red-400',
										info: 'border-blue-100 text-blue-400',
										success: 'border-green-200 text-green-400',
										warning: 'border-yellow-200 text-yellow-400',
										icon: 'w-6 h-6',
										title: 'text-black font-sans font-medium',
										toast: 'flex w-full gap-2 rounded-md border border-l-4 bg-white p-2 shadow-lg items-center',
									},
								}}
							/>
							<PopupContainer />
							{children}
						</RecoilProvider>
					</TanstackQueryProvider>
				</body>
			</html>
		</ViewTransitions>
	);
}
