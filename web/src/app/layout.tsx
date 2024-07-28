import './globals.css';
import { ApiProvider } from '@/api/provider';
import { RecoilProvider } from '@/atoms/provider';
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
					<NextTopLoader color={getTailwindColor('primary')} />
					<ApiProvider>
						<RecoilProvider>{children}</RecoilProvider>
					</ApiProvider>
				</body>
			</html>
		</ViewTransitions>
	);
}
