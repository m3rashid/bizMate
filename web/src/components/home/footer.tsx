import Link from 'next/link';

export const footerLinks = [
	{ name: 'Home', href: '/' },
	{ name: 'About', href: '/about' },
	{ name: 'Changelogs', href: '/changelogs' },
] as const;

type FooterLink = (typeof footerLinks)[number]['href'];

export function Footer(props: { currentRoute: FooterLink }) {
	return (
		<footer>
			<div className='mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8'>
				<nav aria-label='Footer' className='-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12'>
					{footerLinks
						.filter((x) => x.href != props.currentRoute)
						.map((item) => (
							<div key={item.name} className='flex items-center py-3'>
								<Link href={item.href} className='text-sm leading-6 text-gray-600 hover:text-gray-900'>
									{item.name}
								</Link>
							</div>
						))}
				</nav>
				<p className='mt-8 text-center text-xs leading-5 text-gray-500'>&copy; {new Date().getFullYear()} Bizmate, All rights reserved.</p>
			</div>
		</footer>
	);
}
