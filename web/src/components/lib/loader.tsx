import { twMerge } from 'tailwind-merge'

export type LoaderProps = {
	className?: string
}

function Loader(props: LoaderProps) {
	return (
		<div>
			<img
				alt="Loading icon"
				src="https://www.svgrepo.com/show/70469/loading.svg"
				className={twMerge('h-4 w-4 animate-spin', props.className)}
			/>
		</div>
	)
}

export default Loader
