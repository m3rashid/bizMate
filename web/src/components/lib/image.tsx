import { SyntheticEvent } from 'react'
import { twMerge } from 'tailwind-merge'

type ImageProps = {
	src: string
	defaultImgUrl?: string
	className?: string
}

export function Image(props: ImageProps) {
	function addDefaultSource(e: SyntheticEvent<HTMLImageElement, Event>) {
		;(e.target as any).src = props.defaultImgUrl || '/logo.png' // TODO: give a better default placeholder image here
	}

	return <img src={props.src} onError={addDefaultSource} className={props.className} />
}

const avatarSizevariants = { small: 'h-6 w-6', medium: 'h-9 w-9', large: 'h-12 w-12' } as const
export function Avatar(props: ImageProps & { size?: keyof typeof avatarSizevariants }) {
	return <Image {...props} className={twMerge('rounded-full', avatarSizevariants[props.size || 'medium'], props.className)} />
}
