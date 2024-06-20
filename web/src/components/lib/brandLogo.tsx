import { twMerge } from 'tailwind-merge'

export type BrandLogoProps = {
	className?: string
	imgClassName?: string
}

function BrandLogo(props: BrandLogoProps) {
	return (
		<div className={twMerge('flex items-center justify-center', props.className)}>
			<img src="/logo.png" className={twMerge('h-24 w-24 rounded-lg', props.imgClassName)} style={{ viewTransitionName: 'brandLogoImage' }} />
		</div>
	)
}

export default BrandLogo
