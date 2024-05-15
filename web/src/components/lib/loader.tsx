import { twMerge } from 'tailwind-merge'

export type LoaderProps = {
	className?: string
}

export function Loader(props: LoaderProps) {
	return (
		<div>
			<img alt="Loading icon" src="https://www.svgrepo.com/show/70469/loading.svg" className={twMerge('h-4 w-4 animate-spin', props.className)} />
		</div>
	)
}

export function PageLoader(props: LoaderProps) {
	return (
		<div className="flex h-full min-h-96 items-center justify-center">
			<Loader {...props} className={twMerge('h-20 w-20', props.className)} />
		</div>
	)
}
