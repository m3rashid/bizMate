import './globals.css';
import TanstackQueryProvider from '@/api/provider';
import { RecoilProvider } from '@/atoms/provider';
import { PopupContainer } from '@/components/lib/popups';
import { getTailwindColor } from '@/utils/helpers';
import type { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { PropsWithChildren } from 'react';

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
							<PopupContainer />
							{children}
						</RecoilProvider>
					</TanstackQueryProvider>
				</body>
			</html>
		</ViewTransitions>
	);
}
