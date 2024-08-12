import { cn } from '@/utils/helpers';
import Image from 'next/image';

export type BrandLogoProps = {
	className?: string;
	imgClassName?: string;
};

export function BrandLogo(props: BrandLogoProps) {
	return (
		<div className={cn('flex items-center justify-center', props.className)}>
			<Image
				height={96}
				width={96}
				src='/logo.png'
				alt='Brand Logo'
				style={{ viewTransitionName: 'brandLogoImage' }}
				className={cn('h-24 w-24 rounded-lg', props.imgClassName)}
			/>
		</div>
	);
}
